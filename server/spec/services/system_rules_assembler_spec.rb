require "rails_helper"

RSpec.describe SystemRulesAssembler do
  describe "#assemble" do
    it "returns cleanly nested XML without unnecessary spacing" do
      xml = described_class.new.assemble
      formatted = Nokogiri::XML(xml, &:noblanks).root.to_xml(
        indent: PromptSerializers::BaseXmlSerializer::XML_INDENTATION
      )

      expect(xml).to eq(formatted)
    end
  end
end
