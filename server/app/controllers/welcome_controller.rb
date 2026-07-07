class WelcomeController < ActionController::API
  def hello
    render json: { message: "Hello, world!" }, status: :ok
  end
end
