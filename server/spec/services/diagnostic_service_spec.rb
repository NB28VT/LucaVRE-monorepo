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
    let(:sdk_response) do
      instance_double(Anthropic::Models::Message, parsed_output: {}, content: [])
    end
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
      allow(DiagnosticLog).to receive(:create!)
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

    it "passes the structured output schema through to the SDK service" do
      service.call

      expect(generate_kwargs[:output_format]).to eq(described_class::OUTPUT_SCHEMA)
    end

    context "when persisting the SDK response" do
      let(:working_session) do
        create(:working_session, car_id: "ferrari_296_lmgt3", track_id: "spa_francorchamps_gp")
      end
      let(:handling_deficits) do
        [
          create(:handling_deficit, working_session: working_session, location: "high_speed", phase: "entry", symptom: "understeer"),
          create(:handling_deficit, working_session: working_session, location: "low_speed", phase: "exit", symptom: "oversteer")
        ]
      end
      let(:thinking_block) do
        instance_double(Anthropic::Models::ThinkingBlock, type: :thinking, thinking: "Stiffen the rear ARB for exit oversteer.")
      end
      let(:sdk_response) do
        instance_double(
          Anthropic::Models::Message,
          parsed_output: { "rear_arb" => 5, "tc_slip" => 8 },
          content: [thinking_block]
        )
      end

      before do
        allow(DiagnosticLog).to receive(:create!).and_call_original
      end

      it "returns the SDK response" do
        expect(service.call).to eq(sdk_response)
      end

      it "persists a diagnostic log for the working session" do
        expect { service.call }.to change(DiagnosticLog, :count).by(1)

        log = DiagnosticLog.last
        expect(log.working_session).to eq(working_session)
      end

      it "copies car and track ids from the working session" do
        service.call

        log = DiagnosticLog.last
        expect(log.car_id).to eq("ferrari_296_lmgt3")
        expect(log.track_id).to eq("spa_francorchamps_gp")
      end

      it "associates the handling deficits submitted with the call" do
        service.call

        expect(DiagnosticLog.last.handling_deficits).to match_array(handling_deficits)
      end

      it "stores parsed recommendations" do
        service.call

        expect(DiagnosticLog.last.recommendations).to eq("rear_arb" => 5, "tc_slip" => 8)
      end

      it "stores concatenated thinking text" do
        service.call

        expect(DiagnosticLog.last.thought_process).to eq("Stiffen the rear ARB for exit oversteer.")
      end
    end
  end

  describe "OUTPUT_SCHEMA" do
    let(:schema) { described_class::OUTPUT_SCHEMA }
    let(:properties) { schema[:properties] }

    it "allows only the nine in-game GT3 garage settings as optional properties" do
      expect(schema[:type]).to eq("object")
      expect(schema[:additionalProperties]).to eq(false)
      expect(schema[:required]).to eq([])
      expect(properties.keys).to eq(
        %i[
          brake_bias
          rear_wing
          front_ride_height
          rear_ride_height
          front_arb
          rear_arb
          tire_pressures
          tc_cut
          tc_slip
        ]
      )
    end

    it "does not include a thinking field" do
      expect(properties).not_to have_key(:thinking)
    end

    it "enumerates brake_bias as percents from 40.0 to 60.0 in 0.1 increments" do
      values = properties[:brake_bias][:enum]

      expect(properties[:brake_bias][:type]).to eq("number")
      expect(values.first).to eq(40.0)
      expect(values.last).to eq(60.0)
      expect(values.size).to eq(201)
      expect(values.each_cons(2).all? { |left, right| (right - left).round(1) == 0.1 }).to be(true)
    end

    it "enumerates rear_wing as integer steps from 1 to 12" do
      expect(properties[:rear_wing][:type]).to eq("integer")
      expect(properties[:rear_wing][:enum]).to eq((1..12).to_a)
    end

    it "enumerates front_ride_height as millimeters from 45.0 to 85.0 in 0.5 increments" do
      values = properties[:front_ride_height][:enum]

      expect(properties[:front_ride_height][:type]).to eq("number")
      expect(values.first).to eq(45.0)
      expect(values.last).to eq(85.0)
      expect(values.each_cons(2).all? { |left, right| (right - left).round(1) == 0.5 }).to be(true)
    end

    it "enumerates rear_ride_height as millimeters from 60.0 to 115.0 in 0.5 increments" do
      values = properties[:rear_ride_height][:enum]

      expect(properties[:rear_ride_height][:type]).to eq("number")
      expect(values.first).to eq(60.0)
      expect(values.last).to eq(115.0)
      expect(values.each_cons(2).all? { |left, right| (right - left).round(1) == 0.5 }).to be(true)
    end

    it "enumerates front and rear ARB as clicks from 1 to 7" do
      expect(properties[:front_arb][:type]).to eq("integer")
      expect(properties[:rear_arb][:type]).to eq("integer")
      expect(properties[:front_arb][:enum]).to eq((1..7).to_a)
      expect(properties[:rear_arb][:enum]).to eq((1..7).to_a)
    end

    it "enumerates tire_pressures as cold kPa from 130 to 160" do
      expect(properties[:tire_pressures][:type]).to eq("integer")
      expect(properties[:tire_pressures][:enum]).to eq((130..160).to_a)
    end

    it "enumerates tc_cut and tc_slip as map positions from 1 to 11" do
      expect(properties[:tc_cut][:type]).to eq("integer")
      expect(properties[:tc_slip][:type]).to eq("integer")
      expect(properties[:tc_cut][:enum]).to eq((1..11).to_a)
      expect(properties[:tc_slip][:enum]).to eq((1..11).to_a)
    end
  end
end
