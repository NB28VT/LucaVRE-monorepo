require "rails_helper"

RSpec.describe PromptSerializers::HandlingDeficitXmlSerializer, type: :serializer do
  describe "#to_xml" do
    it "produces properly indented xml for the selected handling deficit" do
      handling_deficit = build(:handling_deficit)
      
      expected_xml = <<~XML
        <handling_deficit>
        </handling_deficit>
      XML

      serializer = PromptSerializers::HandlingDeficitXmlSerializer.new(handling_deficit)
      expect(serializer.to_xml.strip).to eq(expected_xml.strip)
    end
  end
end
