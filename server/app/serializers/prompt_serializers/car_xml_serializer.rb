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
        "el:#{::CarDictionary::ENGINE_LAYOUT_MAPPING[@car.engine_layout]}",
        "ad:#{::CarDictionary::AERO_DEPENDENCY_MAPPING[@car.aero_dependency]}",
        "wb:#{::CarDictionary::WHEELBASE_MAPPING[@car.wheelbase]}",
        "wd:#{::CarDictionary::WEIGHT_DISTRIBUTION_MAPPING[@car.weight_distribution]}"
      ]
    end
  end
end
