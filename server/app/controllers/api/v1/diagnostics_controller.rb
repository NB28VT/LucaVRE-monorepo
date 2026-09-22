module Api
  module V1
    class DiagnosticsController < ActionController::API
      TIMEOUT_ERROR = "Setup recommendation request timed out".freeze

      before_action :set_working_session

      def create
        response = DiagnosticService.new(working_session: @working_session).call
        recommendations = DiagnosticService.recommendations_from(response)

        render json: DiagnosticRecommendationSerializer.new(recommendations).serialize, status: :ok
      rescue Anthropic::Errors::APITimeoutError
        render_timeout
      rescue Anthropic::Errors::APIStatusError => error
        raise unless error.status == 504

        render_timeout
      end

      private

      def set_working_session
        @working_session = WorkingSession.find(params[:working_session_id])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: ["Working session not found"] }, status: :not_found
      end

      def render_timeout
        render json: { errors: [TIMEOUT_ERROR] }, status: :gateway_timeout
      end
    end
  end
end
