class HandlingDeficitsController < ActionController::API
  before_action :set_working_session, only: %i[index create]
  before_action :set_handling_deficit, only: %i[show update destroy]

  def index
    handling_deficits = @working_session.handling_deficits
    render json: HandlingDeficitSerializer.new(handling_deficits).serialize, status: :ok
  end

  def show
    render json: HandlingDeficitSerializer.new(@handling_deficit).serialize, status: :ok
  end

  def create
    handling_deficit = @working_session.handling_deficits.new(handling_deficit_params)

    if handling_deficit.save
      render json: HandlingDeficitSerializer.new(handling_deficit).serialize, status: :created
    else
      render json: { errors: handling_deficit.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    if @handling_deficit.update(handling_deficit_params)
      render json: HandlingDeficitSerializer.new(@handling_deficit).serialize, status: :ok
    else
      render json: { errors: @handling_deficit.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    @handling_deficit.destroy
    head :no_content
  end

  private

  def set_working_session
    @working_session = WorkingSession.find(params[:working_session_id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["Working session not found"] }, status: :not_found
  end

  def set_handling_deficit
    @handling_deficit = HandlingDeficit.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { errors: ["Handling deficit not found"] }, status: :not_found
  end

  def handling_deficit_params
    params.require(:handling_deficit).permit(:location, :deficit)
  end
end
