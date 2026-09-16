require "rails_helper"

RSpec.describe PromptSerializers::CarXmlSerializer, type: :serializer do
  describe "#to_xml" do
    it "produces properly indented xml for the selected chassis" do
      car = Car.find("ferrari_296_lmgt3")
      
      expected_xml = <<~XML
        <car_profile>
          <chassis_name>Ferrari 296 LMGT3</chassis_name>
          <car_characteristics>el:me;ad:hi;wb:sh;wd:rb</car_characteristics>
        </car_profile>
      XML

      serializer = PromptSerializers::CarXmlSerializer.new(car)
      expect(serializer.to_xml.strip).to eq(expected_xml.strip)
    end
  end
end
