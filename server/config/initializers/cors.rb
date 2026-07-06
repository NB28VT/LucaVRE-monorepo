Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      # Allow Vite's default dev server port
      origins 'http://localhost:5173', 'http://127.0.0.1:5173'
  
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: true # Set to true if you are sending cookies/sessions across origins
    end
  end
    