class DiagnosticService
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
    @anthropic_sdk_service.generate_response(
      system_rules: system_rules,
      messages: messages
    )
  end

  private

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
