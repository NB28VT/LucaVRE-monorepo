require 'builder'

module PromptSerializers
  class HandlingDeficitXmlSerializer < BaseXmlSerializer
    def initialize(handling_deficit)
      @handling_deficit = handling_deficit
    end

    def to_xml
      xml = ::Builder::XmlMarkup.new(indent: XML_INDENTATION)
      
      xml.handling_deficit do
      end
    end
  end
end
