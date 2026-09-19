class SystemRulesAssembler
  def initialize(version: 'v1')
    @version = version
  end

  def assemble
    xml = ActionController::Base.render(
      template: "prompts/#{@version}/system_rules",
      formats: [:xml]
    )

    Nokogiri::XML(xml, &:noblanks).root.to_xml(
      indent: PromptSerializers::BaseXmlSerializer::XML_INDENTATION
    )
  rescue ActionView::MissingTemplate => e
    Rails.logger.error("Template fallback triggered: #{e.message}")
  end
end
