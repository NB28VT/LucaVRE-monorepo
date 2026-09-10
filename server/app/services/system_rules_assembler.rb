class SystemRulesAssembler
  def initialize(version: 'v1')
    @version = version
  end

  def assemble
    begin
      # Render xml prompt view
      xml = ActionController::Base.render(
        template: "prompts/#{@version}/system_rules",
        formats: [:xml]
      )

      puts Nokogiri::XML(xml).to_xml(indent: 2)
    rescue ActionView::MissingTemplate => e
      Rails.logger.error("Template fallback triggered: #{e.message}")
    end
  end
end
