class WelcomeController < ApplicationController
  def hello
    render json: { message: "Hello, world!" }, status: :ok
  end
end
