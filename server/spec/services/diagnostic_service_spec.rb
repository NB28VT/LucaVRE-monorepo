require "rails_helper"

RSpec.describe DiagnosticService do
  describe "#call" do
    let(:working_session) do
      build(:working_session, car_id: "ferrari_296_lmgt3", track_id: "spa_francorchamps_gp")
    end
    let(:handling_deficits) do
      [
        build(:handling_deficit, working_session: working_session, location: "high_speed", phase: "entry", symptom: "understeer"),
        build(:handling_deficit, working_session: working_session, location: "low_speed", phase: "exit", symptom: "oversteer")
      ]
    end
    let(:system_rules_assembler) { instance_double(SystemRulesAssembler, assemble: "assembled system rules") }
    let(:anthropic_sdk_service) { instance_double(AnthropicSdkService) }
    let(:sdk_response) { "mocked sdk response" }
    let(:generate_kwargs) { {} }
    let(:service) do
      described_class.new(
        working_session: working_session,
        anthropic_sdk_service: anthropic_sdk_service,
        system_rules_assembler: system_rules_assembler
      )
    end
    let(:content) { generate_kwargs[:messages].first[:content] }

    before do
      allow(working_session).to receive(:handling_deficits).and_return(handling_deficits)
      allow(anthropic_sdk_service).to receive(:generate_response) do |**kwargs|
        generate_kwargs.merge!(kwargs)
        sdk_response
      end
    end

    it "requests assembled system rules" do
      service.call

      expect(system_rules_assembler).to have_received(:assemble)
    end

    it "passes assembled system rules through to the SDK service" do
      service.call

      expect(generate_kwargs[:system_rules]).to eq("assembled system rules")
    end

    it "sends a single user message with three content blocks" do
      service.call

      expect(generate_kwargs[:messages].size).to eq(1)
      expect(generate_kwargs[:messages].first[:role]).to eq("user")
      expect(content.size).to eq(3)
    end

    it "uses the car profile XML as the first cached content block" do
      service.call

      expect(content[0]).to eq(
        type: "text",
        text: working_session.car.to_profile_xml,
        cache_control: { type: "ephemeral" }
      )
    end

    it "uses the track profile XML as the second cached content block" do
      service.call

      expect(content[1]).to eq(
        type: "text",
        text: working_session.track.to_profile_xml,
        cache_control: { type: "ephemeral" }
      )
    end

    it "wraps serialized handling deficits in a handling_deficits tag" do
      service.call

      handling_deficits_xml = content[2][:text]
      expect(handling_deficits_xml).to start_with("<handling_deficits>\n")
      expect(handling_deficits_xml).to end_with("\n</handling_deficits>")

      handling_deficits.each do |handling_deficit|
        serialized = PromptSerializers::HandlingDeficitXmlSerializer.new(handling_deficit).to_xml.strip
        expect(handling_deficits_xml).to include(serialized)
      end
    end

    it "does not cache the handling deficits content block" do
      service.call

      expect(content[2]).not_to have_key(:cache_control)
    end

    it "returns the SDK response" do
      expect(service.call).to eq(sdk_response)
    end
  end
end
