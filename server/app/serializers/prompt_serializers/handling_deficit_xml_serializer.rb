require 'builder'
require_relative '../../dictionaries/handling_deficit_dictionary'

module PromptSerializers
  class HandlingDeficitXmlSerializer < BaseXmlSerializer
    def initialize(handling_deficit)
      @handling_deficit = handling_deficit
    end

    def to_xml
      xml = ::Builder::XmlMarkup.new(indent: XML_INDENTATION)
      xml.handling_deficit(serialize_deficit_characteristics)
    end

    private

    def serialize_deficit_characteristics
      [
        "loc:#{Dictionaries::HandlingDeficitDictionary::HANDLING_DEFICIT_LOCATION_MAPPING[@handling_deficit.location]}",
        ("phase:#{Dictionaries::HandlingDeficitDictionary::HANDLING_DEFICIT_PHASE_MAPPING[@handling_deficit.phase]}" if @handling_deficit.phase.present?),
        "sym:#{Dictionaries::HandlingDeficitDictionary::HANDLING_DEFICIT_SYMPTOM_MAPPING[@handling_deficit.symptom]}"
      ].compact.join(';')
    end
  end
end
