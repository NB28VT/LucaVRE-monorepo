require "rails_helper"

RSpec.describe "Diagnostics API", type: :request do
  describe "POST /api/v1/working_sessions/:working_session_id/diagnostic" do
    let(:working_session) { create(:working_session) }
    let(:thinking_text) { "Stiffen the rear ARB for exit oversteer." }
    let(:sdk_response) do
      instance_double(
        Anthropic::Models::Message,
        parsed_output: { "rear_arb" => 5, "tc_slip" => 8 },
        content: [
          instance_double(Anthropic::Models::ThinkingBlock, type: :thinking, thinking: thinking_text)
        ]
      )
    end
    let(:diagnostic_service) { instance_double(DiagnosticService, call: sdk_response) }
    let(:path) { "/api/v1/working_sessions/#{working_session.id}/diagnostic" }

    before do
      allow(DiagnosticService).to receive(:new).and_return(diagnostic_service)
    end

    it "returns camelCase setup recommendations and omits the thought process" do
      post path

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq(
        "recommendations" => { "rearArb" => 5, "tcSlip" => 8 }
      )
      expect(response.body).not_to include(thinking_text)
      expect(response.body).not_to include("thoughtProcess")
    end

    it "calls DiagnosticService with the loaded working session" do
      post path

      expect(DiagnosticService).to have_received(:new).with(working_session: working_session)
      expect(diagnostic_service).to have_received(:call)
    end

    it "returns an empty recommendations object when the SDK omits every setting" do
      allow(sdk_response).to receive(:parsed_output).and_return(nil)

      post path

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq("recommendations" => {})
    end

    it "returns a 404 when the working session does not exist" do
      expect(DiagnosticService).not_to receive(:new)

      post "/api/v1/working_sessions/does-not-exist/diagnostic"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to eq({ "errors" => ["Working session not found"] })
    end

    it "returns a 504 when the SDK client times out and does not create a diagnostic log" do
      allow(diagnostic_service).to receive(:call).and_raise(
        Anthropic::Errors::APITimeoutError.new(url: URI("https://api.anthropic.com/v1/messages"))
      )

      expect { post path }.not_to change(DiagnosticLog, :count)

      expect(response).to have_http_status(:gateway_timeout)
      expect(JSON.parse(response.body)).to eq(
        { "errors" => ["Setup recommendation request timed out"] }
      )
    end

    it "returns a 504 when Anthropic responds with a gateway timeout and does not create a diagnostic log" do
      allow(diagnostic_service).to receive(:call).and_raise(
        Anthropic::Errors::InternalServerError.new(
          url: URI("https://api.anthropic.com/v1/messages"),
          status: 504,
          headers: {},
          body: { error: { type: "timeout_error", message: "Request timed out" } },
          request: nil,
          response: nil
        )
      )

      expect { post path }.not_to change(DiagnosticLog, :count)

      expect(response).to have_http_status(:gateway_timeout)
      expect(JSON.parse(response.body)).to eq(
        { "errors" => ["Setup recommendation request timed out"] }
      )
    end

    context "when the mock SDK is the default collaborator" do
      let(:working_session) do
        create(:working_session, car_id: "ferrari_296_lmgt3", track_id: "spa_francorchamps_gp")
      end

      before do
        allow(DiagnosticService).to receive(:new).and_call_original
      end

      it "returns camelCase mock recommendations and omits the thought process" do
        post path

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq(
          "recommendations" => MockAnthropicSdkService::PARSED_OUTPUT.transform_keys { |key| key.camelize(:lower) }
        )
        expect(response.body).not_to include(MockAnthropicSdkService::THOUGHT_PROCESS)
        expect(response.body).not_to include("thoughtProcess")
      end

      it "persists a diagnostic log for the mock response" do
        expect { post path }.to change(DiagnosticLog, :count).by(1)

        log = DiagnosticLog.last
        expect(log.recommendations).to eq(MockAnthropicSdkService::PARSED_OUTPUT)
        expect(log.thought_process).to eq(MockAnthropicSdkService::THOUGHT_PROCESS)
      end
    end
  end
end
