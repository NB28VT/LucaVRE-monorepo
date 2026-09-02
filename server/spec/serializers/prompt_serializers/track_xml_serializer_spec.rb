require "rails_helper"

RSpec.describe PromptSerializers::TrackXmlSerializer, type: :serializer do
  describe "#to_xml" do
    it "produces properly indented xml for the selected track" do
      track = Track.find("spa_francorchamps_gp")

      # downforce_requirement: medium, surface_roughness: smooth, curb_intensity: medium,
      # primary_characteristic: elevation_changes, compression_zones_compression, high_speed_stability, aerodynamic_efficiency_test
      expected_xml = <<~XML
        <track_profile>
          <track_name>Spa-Francorchamps - Grand Prix</track_name>
          <track_characteristics>dr:md;sr:sm;ci:me;pc:elc,czc,hss,aet</track_characteristics>
        </track_profile>
      XML

      serializer = PromptSerializers::TrackXmlSerializer.new(track)
      expect(serializer.to_xml.strip).to eq(expected_xml.strip)
    end
  end
end
