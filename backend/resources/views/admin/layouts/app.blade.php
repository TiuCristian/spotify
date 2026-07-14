<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf-8">
  <title>Admin Dashboard - Stainify</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="{{ asset('stainify-logo.png') }}">
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
          <i class="fas fa-bars text-body fs-4"></i>
        </button>
        <div class="app-header-start d-none d-md-flex">
          <div class="badge-standard d-none d-lg-inline-block">
            Stainify Admin Panel
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
                <div class="avatar-text bg-primary text-white"><i class="fas fa-user"></i></div>
              </div>
            </a>
            <ul class="dropdown-menu dropdown-menu-end w-225px mt-1">
              <li>
                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="dropdown-item d-flex align-items-center gap-2 text-danger">
                    <i class="fas fa-sign-out-alt scale-1x"></i> Log Out
                    </button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <aside class="app-menubar-tabs" id="appMenubar">
      <div class="app-navbar-brand" style="display: flex; justify-content: center; align-items: center;">
        <a class="navbar-brand-logo" href="{{ route('admin.users.index') }}" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <img src="{{ asset('stainify-logo.png') }}" alt="Stainify Logo" style="width: 36px; height: 36px; object-fit: contain;">
        </a>
      </div>
      <div class="app-navbar-tabs" data-simplebar>
        <ul class="nav" id="appMenubarTabs" role="tablist">
          <li class="nav-item">
            <a class="menu-link active" href="#dashboardTab" role="tab" data-bs-toggle="tab">
              <i class="fas fa-home fs-4 text-primary"></i>
            </a>
          </li>
        </ul>
      </div>
      <div class="app-tab-content">
        <div class="app-side-brands d-flex align-items-center">
          <a class="navbar-brand-text fs-3 fw-bold text-primary" href="{{ route('admin.users.index') }}" style="text-decoration: none; padding-left: 20px;">Stainify</a>
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
                      <i class="fas fa-users text-primary" style="margin-right: 12px; font-size: 18px; line-height: 1;"></i>
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
