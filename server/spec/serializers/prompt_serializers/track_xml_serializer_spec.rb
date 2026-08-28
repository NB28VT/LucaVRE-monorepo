require "rails_helper"

RSpec.describe PromptSerializers::TrackXmlSerializer, type: :serializer do
  describe "#to_xml" do
    it "produces properly indented xml for the selected track" do
      track = Track.find("spa_francorchamps_gp")
      
      expected_xml = <<~XML
        <track_profile>
          <track_name>Spa-Francorchamps - Grand Prix</track_name>
        </track_profile>
      XML

      serializer = PromptSerializers::TrackXmlSerializer.new(track)
      expect(serializer.to_xml.strip).to eq(expected_xml.strip)
    end
  end
end
