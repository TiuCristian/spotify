<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf-8">
  <title>Admin Dashboard - Spotify</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="{{ asset('admin-assets/assets/images/favicon.png') }}">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/libs/flaticon/css/all/all.css') }}">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/libs/fontawesome/css/all.min.css') }}">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/libs/simplebar/simplebar.css') }}">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/css/styles.css') }}">
</head>
<body>
  <div class="page-layout">

    <header class="app-header">
      <div class="app-header-inner">
        <button class="app-toggler" type="button" aria-label="app toggler">
          <i class="fi fi-rr-menu-burger"></i>
        </button>
        <div class="app-header-start d-none d-md-flex">
          <div class="badge-standard d-none d-lg-inline-block">
            Spotify Admin Panel
          </div>
        </div>
        <div class="app-header-end">
          <div class="px-lg-4 px-2 ps-0 d-flex align-items-center">
            <a href="javascript:void(0);" class="theme-btn">
               <div class="theme-toggle"></div>
            </a>
          </div>
          <div class="vr my-3"></div>
          <div class="dropdown text-end ms-sm-3 ms-2 ms-lg-4">
            <a href="#" class="d-flex align-items-center py-2" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
              <div class="text-end me-2 d-none d-lg-inline-block">
                <div class="fw-bold text-dark">{{ auth()->user()->name ?? 'Admin' }}</div>
                <small class="text-body d-block lh-sm">
                  <i class="fi fi-rr-angle-down text-3xs me-1"></i> Admin
                </small>
              </div>
              <div class="avatar avatar-sm rounded-circle avatar-status-success">
                <div class="avatar-text bg-primary text-white"><i class="fi fi-rr-user"></i></div>
              </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end w-225px mt-1">
              <li>
                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="dropdown-item d-flex align-items-center gap-2 text-danger">
                    <i class="fi fi-sr-exit scale-1x"></i> Log Out
                    </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <aside class="app-menubar-tabs" id="appMenubar">
      <div class="app-navbar-brand">
        <a class="navbar-brand-logo" href="{{ route('admin.users.index') }}">
          <h3 class="mb-0 text-primary" style="margin-left: 10px;">Spotify</h3>
        </a>
      </div>
      <div class="app-navbar-tabs" data-simplebar>
        <ul class="nav" id="appMenubarTabs" role="tablist">
          <li class="nav-item">
            <a class="menu-link active" href="#dashboardTab" role="tab" data-bs-toggle="tab">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.5" d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" stroke="var(--bs-heading-color)" stroke-width="2" />
                <path d="M12 15V18" stroke="var(--bs-heading-color)" stroke-width="2" stroke-linecap="round" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <div class="app-tab-content">
        <div class="app-side-brands">
          <a class="navbar-brand-text" href="{{ route('admin.users.index') }}">Spotify</a>
        </div>
        <div class="app-content-inner">
          <div class="tab-content" id="appMenubarTabsContent">
            <div class="tab-pane fade show active" id="dashboardTab" role="tabpanel" tabindex="0">
              <nav class="app-navbar" data-simplebar>
                <ul class="side-menubar">
                  <li class="menu-heading">
                    <span class="menu-label">Dashboard</span>
                  </li>
                  <li class="menu-item">
                    <a class="menu-link active" href="{{ route('admin.users.index') }}">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="6" fill="var(--bs-info)" />
                      </svg>
                      <span class="menu-label">User Management</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="app-wrapper">
      <div class="container-fluid">
        @yield('content')
      </div>
    </main>

  </div>
  <script src="{{ asset('admin-assets/assets/libs/global/global.min.js') }}"></script>
  <script src="{{ asset('admin-assets/assets/js/appSettings.js') }}"></script>
  <script src="{{ asset('admin-assets/assets/js/main.js') }}"></script>
</body>
</html>
