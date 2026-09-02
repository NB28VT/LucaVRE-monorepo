require 'builder'
require_relative '../../dictionaries/car_dictionary'

module PromptSerializers
  class CarXmlSerializer < BaseXmlSerializer
    def initialize(car)
      @car = car
    end

    def to_xml
      xml = ::Builder::XmlMarkup.new(indent: XML_INDENTATION)
      
      xml.car_profile do
        xml.chassis_name @car.name
        xml.car_characteristics serialize_car_characteristics.join(';')
      end
    end

    private

    def serialize_car_characteristics
      [
        "ep:#{Dictionaries::CarDictionary::ENGINE_PLACEMENT_MAPPING[@car.engine_placement]}",
        "ap:#{Dictionaries::CarDictionary::AERO_PLATFORM_MAPPING[@car.aero_platform]}",
        "wb:#{Dictionaries::CarDictionary::WHEELBASE_MAPPING[@car.wheelbase]}",
        "pq:#{Array(@car.primary_quirk).map { |quirk| Dictionaries::CarDictionary::PRIMARY_QUIRK_MAPPING[quirk] }.compact.join(',')}"
      ]
    end
  end
end
