module Api
  module V1
    class WorkingSessionsController < ActionController::API
      before_action :set_working_session, only: %i[show update destroy]

      def index
        working_sessions = WorkingSession.all
        render json: WorkingSessionSerializer.new(working_sessions).serialize, status: :ok
      end

      def show
        render json: WorkingSessionSerializer.new(@working_session).serialize, status: :ok
      end

      def create
        working_session = WorkingSession.new(working_session_params)

        if working_session.save
          render json: WorkingSessionSerializer.new(working_session).serialize, status: :created
        else
          render json: { errors: working_session.errors.full_messages }, status: :unprocessable_content
        end
      end

      def update
        if @working_session.update(working_session_params)
          render json: WorkingSessionSerializer.new(@working_session).serialize, status: :ok
        else
          render json: { errors: @working_session.errors.full_messages }, status: :unprocessable_content
        end
      end

      def destroy
        @working_session.destroy
        head :no_content
      end

      private

      def set_working_session
        @working_session = WorkingSession.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: ["Working session not found"] }, status: :not_found
      end

      def working_session_params
        params.require(:working_session).permit(:car_id, :track_id)
      end
    end
  end
end
