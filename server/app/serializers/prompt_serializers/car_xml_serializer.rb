require 'builder'

module PromptSerializers
  class CarXmlSerializer < BaseXmlSerializer
    def initialize(car)
      @car = car
    end

    def to_xml
      xml = ::Builder::XmlMarkup.new(indent: XML_INDENTATION)
      
      xml.car_profile do
        xml.chassis_name @car.name
      end
    end
  end
end
