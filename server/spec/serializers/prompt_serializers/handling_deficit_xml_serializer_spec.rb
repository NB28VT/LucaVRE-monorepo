require "rails_helper"

RSpec.describe PromptSerializers::HandlingDeficitXmlSerializer, type: :serializer do
  describe "#to_xml" do
    it "produces properly indented xml for the selected handling deficit and attributes are mapped correctly" do
      handling_deficit = build(:handling_deficit, location: 'high_speed', phase: 'entry', symptom: 'understeer')
      expected_xml = "<handling_deficit>loc:hi_spd;phase:entry;sym:us</handling_deficit>"

      serializer = PromptSerializers::HandlingDeficitXmlSerializer.new(handling_deficit)
      expect(serializer.to_xml.strip).to eq(expected_xml.strip)
    end

    it 'does not include phase attribute if it is nil' do
      handling_deficit = build(:handling_deficit, location: 'high_speed', phase: nil, symptom: 'understeer')
      expected_xml = "<handling_deficit>loc:hi_spd;sym:us</handling_deficit>"

      serializer = PromptSerializers::HandlingDeficitXmlSerializer.new(handling_deficit)
      expect(serializer.to_xml.strip).to eq(expected_xml.strip)
    end
  end
end
