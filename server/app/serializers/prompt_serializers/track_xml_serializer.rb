require 'builder'

module PromptSerializers
  class TrackXmlSerializer < BaseXmlSerializer
    def initialize(track)
      @track = track
    end

    def to_xml
      xml = ::Builder::XmlMarkup.new(indent: XML_INDENTATION)
      
      xml.track_profile do
        xml.track_name @track.name
      end
    end
  end
end
