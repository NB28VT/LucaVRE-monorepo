class DiagnosticService
  BRAKE_BIAS_VALUES = (400..600).map { |tenths| tenths / 10.0 }.freeze
  REAR_WING_VALUES = (1..12).to_a.freeze
  FRONT_RIDE_HEIGHT_VALUES = (90..170).map { |halves| halves / 2.0 }.freeze
  REAR_RIDE_HEIGHT_VALUES = (120..230).map { |halves| halves / 2.0 }.freeze
  ARB_VALUES = (1..7).to_a.freeze
  TIRE_PRESSURE_VALUES = (130..160).to_a.freeze
  TC_VALUES = (1..11).to_a.freeze

  OUTPUT_SCHEMA = {
    type: "object",
    additionalProperties: false,
    required: [],
    description: "Recommended Le Mans Ultimate GT3 garage settings to show the player. " \
      "Include at most five properties. Omit any setting that should not change. " \
      "Every value is the target in-game setting, not a delta.",
    properties: {
      brake_bias: {
        type: "number",
        description: "Front brake bias as a percent (%) of total braking force.",
        enum: BRAKE_BIAS_VALUES
      },
      rear_wing: {
        type: "integer",
        description: "Rear wing position in integer garage steps.",
        enum: REAR_WING_VALUES
      },
      front_ride_height: {
        type: "number",
        description: "Front ride height in millimeters (mm).",
        enum: FRONT_RIDE_HEIGHT_VALUES
      },
      rear_ride_height: {
        type: "number",
        description: "Rear ride height in millimeters (mm).",
        enum: REAR_RIDE_HEIGHT_VALUES
      },
      front_arb: {
        type: "integer",
        description: "Front anti-roll bar stiffness in garage clicks. 1 is fully soft, 7 is fully stiff.",
        enum: ARB_VALUES
      },
      rear_arb: {
        type: "integer",
        description: "Rear anti-roll bar stiffness in garage clicks. 1 is fully soft, 7 is fully stiff.",
        enum: ARB_VALUES
      },
      tire_pressures: {
        type: "integer",
        description: "Cold tire inflation pressure in kilopascals (kPa).",
        enum: TIRE_PRESSURE_VALUES
      },
      tc_cut: {
        type: "integer",
        description: "Traction control cut map position. 1 is minimum power reduction, 11 is maximum intervention.",
        enum: TC_VALUES
      },
      tc_slip: {
        type: "integer",
        description: "Traction control slip map position. 1 allows the most slip, 11 allows the least.",
        enum: TC_VALUES
      }
    }
  }.freeze

  def initialize(
    working_session:,
    anthropic_sdk_service: AnthropicSdkService.new,
    system_rules_assembler: SystemRulesAssembler.new
  )
    @working_session = working_session
    @anthropic_sdk_service = anthropic_sdk_service
    @system_rules_assembler = system_rules_assembler
  end

  def call
    system_rules = @system_rules_assembler.assemble
    response = @anthropic_sdk_service.generate_response(
      system_rules: system_rules,
      messages: messages,
      output_format: OUTPUT_SCHEMA
    )
    persist_diagnostic_log(response)
    response
  end

  def self.recommendations_from(response)
    output = response.parsed_output
    return {} if output.nil?

    hash = output.respond_to?(:deep_to_h) ? output.deep_to_h : output
    hash.respond_to?(:to_h) ? hash.to_h : {}
  end

  private

  def persist_diagnostic_log(response)
    DiagnosticLog.create!(
      working_session: @working_session,
      car_id: @working_session.car_id,
      track_id: @working_session.track_id,
      handling_deficits: @working_session.handling_deficits.to_a,
      recommendations: self.class.recommendations_from(response),
      thought_process: extract_thought_process(response)
    )
  end

  def extract_thought_process(response)
    return nil unless response.respond_to?(:content)

    thinking = Array(response.content).filter_map do |block|
      next unless block.respond_to?(:type) && block.type == :thinking
      next unless block.respond_to?(:thinking)

      block.thinking.presence
    end

    thinking.join("\n\n").presence
  end

  def messages
    [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: @working_session.car.to_profile_xml,
            cache_control: { type: "ephemeral" }
          },
          {
            type: "text",
            text: @working_session.track.to_profile_xml,
            cache_control: { type: "ephemeral" }
          },
          {
            type: "text",
            text: handling_deficits_xml
          }
        ]
      }
    ]
  end

  def handling_deficits_xml
    indent = " " * PromptSerializers::BaseXmlSerializer::XML_INDENTATION
    deficit_xml = @working_session.handling_deficits.map do |handling_deficit|
      "#{indent}#{PromptSerializers::HandlingDeficitXmlSerializer.new(handling_deficit).to_xml.strip}"
    end.join("\n")

    "<handling_deficits>\n#{deficit_xml}\n</handling_deficits>"
  end
end
