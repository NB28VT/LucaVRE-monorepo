require 'builder'
require_relative '../../dictionaries/track_dictionary'

module PromptSerializers
  class TrackXmlSerializer < BaseXmlSerializer
    def initialize(track)
      @track = track
    end

    def to_xml
      xml = ::Builder::XmlMarkup.new(indent: XML_INDENTATION)
      
      xml.track_profile do
        xml.track_name @track.name
        xml.track_characteristics serialize_track_characteristics.join(';')
      end
    end

    private

    def serialize_track_characteristics
      [
        "ar:#{::TrackDictionary::AERO_REQUIREMENT_MAPPING[@track.aero_requirement]}",
        "cs:#{::TrackDictionary::DOMINANT_CORNER_SPEED_MAPPING[@track.dominant_corner_speed]}",
        "sb:#{::TrackDictionary::SURFACE_BUMPINESS_MAPPING[@track.surface_bumpiness]}",
        "td:#{::TrackDictionary::TIRE_DEGRADATION_RATE_MAPPING[@track.tire_degradation_rate]}",
        "lt:#{::TrackDictionary::LAYOUT_TYPE_MAPPING[@track.layout_type]}"
      ]
    end
  end
end
