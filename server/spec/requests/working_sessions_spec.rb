require 'rails_helper'

RSpec.describe "WorkingSessions API", type: :request do
  describe "GET /working_sessions" do
    it "returns all working sessions serialized with camelCase keys" do
      working_sessions = create_list(:working_session, 2)

      get "/working_sessions"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body.size).to eq(2)
      expect(body.map { |ws| ws["id"] }).to match_array(working_sessions.map(&:id))
      expect(body.first.keys).to match_array(%w[id carId trackId createdAt])
    end

    it "returns an empty array when there are no working sessions" do
      get "/working_sessions"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end
  end

  describe "GET /working_sessions/:id" do
    it "returns the requested working session" do
      working_session = create(:working_session)

      get "/working_sessions/#{working_session.id}"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["id"]).to eq(working_session.id)
      expect(body["carId"]).to eq(working_session.car_id)
      expect(body["trackId"]).to eq(working_session.track_id)
    end

    it "returns a 404 when the working session does not exist" do
      get "/working_sessions/does-not-exist"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to eq({ "errors" => ["Working session not found"] })
    end
  end

  describe "POST /working_sessions" do
    it "creates a working session with the given car and track" do
      expect {
        post "/working_sessions", params: { working_session: { car_id: "car-1", track_id: "track-1" } }
      }.to change(WorkingSession, :count).by(1)

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)
      expect(body["carId"]).to eq("car-1")
      expect(body["trackId"]).to eq("track-1")
    end

    it "ignores unpermitted params via strong params" do
      post "/working_sessions", params: {
        working_session: { car_id: "car-1", track_id: "track-1", id: 999 }
      }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["id"]).not_to eq(999)
    end

    it "returns unprocessable_content and does not persist when validations fail" do
      allow_any_instance_of(WorkingSession).to receive(:save).and_return(false)

      expect {
        post "/working_sessions", params: { working_session: { car_id: "", track_id: "" } }
      }.not_to change(WorkingSession, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end
  end

  describe "PATCH /working_sessions/:id" do
    it "updates the car and track selection" do
      working_session = create(:working_session, car_id: "old-car", track_id: "old-track")

      patch "/working_sessions/#{working_session.id}",
            params: { working_session: { car_id: "new-car", track_id: "new-track" } }

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["carId"]).to eq("new-car")
      expect(body["trackId"]).to eq("new-track")
      expect(working_session.reload.car_id).to eq("new-car")
      expect(working_session.reload.track_id).to eq("new-track")
    end

    it "returns unprocessable_content when the update is invalid" do
      working_session = create(:working_session)

      allow_any_instance_of(WorkingSession).to receive(:update).and_return(false)

      patch "/working_sessions/#{working_session.id}",
            params: { working_session: { car_id: "" } }

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end

    it "returns a 404 when the working session does not exist" do
      patch "/working_sessions/does-not-exist", params: { working_session: { car_id: "new-car" } }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /working_sessions/:id" do
    it "deletes the working session" do
      working_session = create(:working_session)

      expect {
        delete "/working_sessions/#{working_session.id}"
      }.to change(WorkingSession, :count).by(-1)

      expect(response).to have_http_status(:no_content)
      expect(WorkingSession.exists?(working_session.id)).to be false
    end

    it "returns a 404 when the working session does not exist" do
      delete "/working_sessions/does-not-exist"

      expect(response).to have_http_status(:not_found)
    end
  end
end
