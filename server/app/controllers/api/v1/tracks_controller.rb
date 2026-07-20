module Api
  module V1
    class TracksController < ActionController::API
      def index
        render json: TrackSerializer.new(Track.all).serialize, status: :ok
      end
    end
  end
end
