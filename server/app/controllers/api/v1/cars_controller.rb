module Api
  module V1
    class CarsController < ActionController::API
      def index
        render json: CarSerializer.new(Car.all).serialize, status: :ok
      end
    end
  end
end
