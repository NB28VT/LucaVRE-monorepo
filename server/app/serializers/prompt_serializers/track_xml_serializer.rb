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
        "dr:#{Dictionaries::TrackDictionary::DOWNFORCE_REQUIREMENT_MAPPING[@track.downforce_requirement]}",
        "sr:#{Dictionaries::TrackDictionary::SURFACE_ROUGHNESS_MAPPING[@track.surface_roughness]}",
        "ci:#{Dictionaries::TrackDictionary::CURB_INTENSITY_MAPPING[@track.curb_intensity]}",
        "pc:#{Array(@track.primary_characteristic).map { |characteristic| Dictionaries::TrackDictionary::PRIMARY_CHARACTERISTIC_MAPPING[characteristic] }.compact.join(',')}"
      ]
    end
  end
end
