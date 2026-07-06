require 'rails_helper' # Loads the Rails test environment

RSpec.describe "Welcome API", type: :request do
  describe "GET /welcome/hello" do
    it "returns a successful JSON response" do
      get "/welcome/hello"
      
      expect(response).to have_http_status(:ok) # Verifies status code 200
      expect(JSON.parse(response.body)).to eq({ "message" => "Hello, world!" })
    end
  end
end
