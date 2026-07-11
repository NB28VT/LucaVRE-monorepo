require 'rails_helper'

RSpec.describe "HandlingDeficits API", type: :request do
  describe "GET /working_sessions/:working_session_id/handling_deficits" do
    it "returns all handling deficits for the working session serialized with camelCase keys" do
      working_session = create(:working_session)
      handling_deficits = create_list(:handling_deficit, 2, working_session: working_session)

      get "/working_sessions/#{working_session.id}/handling_deficits"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body.size).to eq(2)
      expect(body.map { |hd| hd["id"] }).to match_array(handling_deficits.map(&:id))
      expect(body.first.keys).to match_array(%w[id workingSessionId location deficit createdAt])
    end

    it "returns an empty array when the working session has no handling deficits" do
      working_session = create(:working_session)

      get "/working_sessions/#{working_session.id}/handling_deficits"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end

    it "does not return handling deficits belonging to other working sessions" do
      working_session = create(:working_session)
      other_working_session = create(:working_session)
      create(:handling_deficit, working_session: other_working_session)

      get "/working_sessions/#{working_session.id}/handling_deficits"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq([])
    end

    it "returns a 404 when the working session does not exist" do
      get "/working_sessions/does-not-exist/handling_deficits"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to eq({ "errors" => ["Working session not found"] })
    end
  end

  describe "GET /handling_deficits/:id" do
    it "returns the requested handling deficit" do
      handling_deficit = create(:handling_deficit)

      get "/handling_deficits/#{handling_deficit.id}"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["id"]).to eq(handling_deficit.id)
      expect(body["workingSessionId"]).to eq(handling_deficit.working_session_id)
      expect(body["location"]).to eq(handling_deficit.location)
      expect(body["deficit"]).to eq(handling_deficit.deficit)
    end

    it "returns a 404 when the handling deficit does not exist" do
      get "/handling_deficits/does-not-exist"

      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to eq({ "errors" => ["Handling deficit not found"] })
    end
  end

  describe "POST /working_sessions/:working_session_id/handling_deficits" do
    it "creates a handling deficit for the given working session" do
      working_session = create(:working_session)

      expect {
        post "/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "trackwide", deficit: "oversteer" } }
      }.to change(HandlingDeficit, :count).by(1)

      expect(response).to have_http_status(:created)

      body = JSON.parse(response.body)
      expect(body["workingSessionId"]).to eq(working_session.id)
      expect(body["location"]).to eq("trackwide")
      expect(body["deficit"]).to eq("oversteer")
    end

    it "ignores unpermitted params via strong params" do
      working_session = create(:working_session)

      post "/working_sessions/#{working_session.id}/handling_deficits",
           params: { handling_deficit: { location: "trackwide", deficit: "oversteer", id: 999 } }

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["id"]).not_to eq(999)
    end

    it "returns unprocessable_content and does not persist when validations fail" do
      working_session = create(:working_session)

      expect {
        post "/working_sessions/#{working_session.id}/handling_deficits",
             params: { handling_deficit: { location: "front", deficit: "wobbly" } }
      }.not_to change(HandlingDeficit, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end

    it "returns a 404 when the working session does not exist" do
      post "/working_sessions/does-not-exist/handling_deficits",
           params: { handling_deficit: { location: "trackwide", deficit: "oversteer" } }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH /handling_deficits/:id" do
    it "updates the location and deficit" do
      handling_deficit = create(:handling_deficit, location: "trackwide", deficit: "oversteer")

      patch "/handling_deficits/#{handling_deficit.id}",
            params: { handling_deficit: { deficit: "understeer" } }

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["deficit"]).to eq("understeer")
      expect(handling_deficit.reload.deficit).to eq("understeer")
    end

    it "returns unprocessable_content when the update is invalid" do
      handling_deficit = create(:handling_deficit)

      patch "/handling_deficits/#{handling_deficit.id}",
            params: { handling_deficit: { deficit: "wobbly" } }

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)).to have_key("errors")
    end

    it "returns a 404 when the handling deficit does not exist" do
      patch "/handling_deficits/does-not-exist", params: { handling_deficit: { deficit: "understeer" } }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /handling_deficits/:id" do
    it "deletes the handling deficit" do
      handling_deficit = create(:handling_deficit)

      expect {
        delete "/handling_deficits/#{handling_deficit.id}"
      }.to change(HandlingDeficit, :count).by(-1)

      expect(response).to have_http_status(:no_content)
      expect(HandlingDeficit.exists?(handling_deficit.id)).to be false
    end

    it "returns a 404 when the handling deficit does not exist" do
      delete "/handling_deficits/does-not-exist"

      expect(response).to have_http_status(:not_found)
    end
  end
end
