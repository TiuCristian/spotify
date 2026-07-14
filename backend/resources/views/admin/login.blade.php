<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Admin Login - Stainify Backend</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="{{ asset('stainify-logo.png') }}">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/libs/fontawesome/css/all.min.css') }}">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/css/styles.css') }}">
</head>
<body>
  <div class="page-layout">
    <div class="auth-wrapper min-vh-100 px-2">
      <div class="row g-0 min-vh-100">
        <div class="col-xl-5 col-lg-6 ms-auto px-sm-4 align-self-center py-4 d-none d-lg-block">
          <img src="{{ asset('admin-assets/assets/images/auth/vector2.svg') }}" alt="" class="img-fluid">
        </div>
        <div class="col-xl-5 col-lg-6 ms-auto px-sm-4 align-self-center py-4">
          <div class="card card-body p-4 p-sm-5 maxw-450px m-auto rounded-4">
            <div class="text-center mb-4">
              <h5 class="mb-1">Admin Login</h5>
              <p>Sign in to access your secure admin dashboard.</p>
            </div>
            
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('admin.login.submit') }}" method="POST">
              @csrf
              <div class="mb-4">
                <label class="form-label" for="loginEmail">Email Address</label>
                <input type="email" name="email" class="form-control" id="loginEmail" placeholder="info@example.com" value="{{ old('email') }}" required>
              </div>
              <div class="mb-4">
                <label class="form-label" for="loginPassword">Password</label>
                <div class="password-wrapper">
                  <input type="password" name="password" class="form-control password-input" id="loginPassword" placeholder="********" required>
                </div>
              </div>
              <div class="mb-3">
                <button type="submit" value="Submit" class="btn btn-primary w-100">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="{{ asset('admin-assets/assets/libs/global/global.min.js') }}"></script>
  <script src="{{ asset('admin-assets/assets/js/main.js') }}"></script>
</body>
</html>
