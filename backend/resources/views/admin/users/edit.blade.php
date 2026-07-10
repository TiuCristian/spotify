<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>User Profile - Spotify Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/libs/fontawesome/css/all.min.css') }}">
  <style>
    body {
        background-color: #121212;
        color: #fff;
        font-family: 'Inter', sans-serif;
        margin: 0;
    }
    .spotify-header {
        background-color: #000;
        padding: 16px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .spotify-header a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
    }
    .profile-container {
        display: flex;
        max-width: 1200px;
        margin: 40px auto;
        padding: 0 20px;
        gap: 40px;
    }
    .sidebar {
        width: 250px;
        flex-shrink: 0;
    }
    .sidebar-section {
        margin-bottom: 30px;
    }
    .sidebar-section h3 {
        font-size: 14px;
        color: #b3b3b3;
        margin-bottom: 15px;
        text-transform: uppercase;
    }
    .sidebar-item {
        display: block;
        padding: 10px 0;
        color: #fff;
        text-decoration: none;
        font-size: 15px;
        transition: color 0.2s;
        cursor: pointer;
    }
    .sidebar-item:hover, .sidebar-item.active {
        color: #1ed760;
    }
    .main-content {
        flex: 1;
        background: #181818;
        border-radius: 8px;
        padding: 40px;
    }
    .main-content h1 {
        font-size: 32px;
        margin-top: 0;
        margin-bottom: 10px;
    }
    .form-group {
        margin-bottom: 25px;
    }
    .form-group label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
        color: #b3b3b3;
    }
    .form-control {
        width: 100%;
        background-color: #282828;
        border: 1px solid #727272;
        color: #fff;
        padding: 12px;
        border-radius: 4px;
        font-size: 16px;
        box-sizing: border-box;
    }
    .form-control:focus {
        border-color: #fff;
        outline: none;
    }
    .btn-save {
        background-color: #1ed760;
        color: #000;
        border: none;
        padding: 14px 32px;
        border-radius: 500px;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
    }
    .btn-save:hover {
        background-color: #1fdf64;
        transform: scale(1.04);
    }
    .btn-danger {
        background-color: transparent;
        color: #f15e6c;
        border: 1px solid #727272;
        padding: 14px 32px;
        border-radius: 500px;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        margin-top: 20px;
    }
    .btn-danger:hover {
        border-color: #f15e6c;
    }
    .alert {
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
    }
    .alert-success { background: rgba(30, 215, 96, 0.2); color: #1ed760; border: 1px solid #1ed760; }
    .alert-danger { background: rgba(241, 94, 108, 0.2); color: #f15e6c; border: 1px solid #f15e6c; }
    .avatar-upload {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 30px;
    }
    .avatar-preview {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #282828;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
        color: #b3b3b3;
    }
    select.form-control {
        appearance: none;
    }
  </style>
</head>
<body>

  <div class="spotify-header">
    <div>
        <a href="{{ route('admin.users.index') }}"><i class="fas fa-arrow-left"></i> Back to Admin Dashboard</a>
    </div>
    <div>
        <span>{{ auth()->user()->name }} (Admin)</span>
    </div>
  </div>

  <div class="profile-container">
    <div class="sidebar">
        <div class="sidebar-section">
            <h3>Account</h3>
            <a onclick="showTab('personalInfoTab', this)" class="sidebar-item active"><i class="fas fa-pencil-alt"></i> Edit personal info</a>
            <a onclick="showTab('playlistsTab', this)" class="sidebar-item"><i class="fas fa-music"></i> Manage Playlists</a>
            <a onclick="showTab('socialTab', this)" class="sidebar-item"><i class="fas fa-users"></i> Social Connections</a>
        </div>
        <div class="sidebar-section">
            <h3>Subscription</h3>
            <a class="sidebar-item"><i class="fas fa-gem"></i> Available subscriptions</a>
            <a class="sidebar-item"><i class="fas fa-cog"></i> Manage subscription</a>
        </div>
        <div class="sidebar-section">
            <h3>Payment</h3>
            <a class="sidebar-item"><i class="fas fa-history"></i> Payment history</a>
        </div>
        <div class="sidebar-section">
            <h3>Security and Privacy</h3>
            <a class="sidebar-item"><i class="fas fa-lock"></i> Notification settings</a>
            <a class="sidebar-item"><i class="fas fa-shield-alt"></i> Account privacy</a>
        </div>
    </div>

    <div class="main-content" id="personalInfoTab">
        <h1>Edit personal info</h1>
        <p style="color: #b3b3b3; margin-bottom: 30px;">Manage details for user #{{ $user->id }}</p>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul style="margin:0; padding-left: 20px;">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('admin.users.update', $user->id) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div class="avatar-upload">
                <div class="avatar-preview">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <p style="margin-top:0;">Profile picture</p>
                    <button type="button" style="background:transparent; color:#fff; border: 1px solid #727272; padding: 8px 16px; border-radius: 500px; cursor: pointer;">Choose file</button>
                    <p style="color:#b3b3b3; font-size:12px; margin-bottom:0;">File must be JPEG or PNG.</p>
                </div>
            </div>

            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" required>
            </div>

            <div class="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input type="password" name="password" class="form-control" placeholder="Create a new password">
            </div>

            <div class="form-group">
                <label>Role</label>
                <select name="role" class="form-control" required>
                    <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>User</option>
                    <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
                </select>
            </div>

            <div style="text-align: right;">
                <button type="submit" class="btn-save">Save Profile</button>
            </div>
        </form>

        <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #282828;">
            <h2 style="color: #f15e6c; font-size: 24px; margin-top:0;">Delete Account</h2>
            <p style="color: #b3b3b3;">Permanently delete this user from the platform.</p>
            <form id="deleteUserForm" action="{{ route('admin.users.destroy', $user->id) }}" method="POST">
                @csrf
                @method('DELETE')
                <button type="button" onclick="openModal()" class="btn-danger" {{ auth()->id() === $user->id ? 'disabled' : '' }}>Delete User</button>
            </form>
        </div>
    </div>

    <!-- Custom Delete Modal -->
    <div id="deleteModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; align-items: center; justify-content: center;">
        <div style="background: #282828; padding: 30px; border-radius: 12px; width: 400px; text-align: center; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="font-size: 40px; color: #f15e6c; margin-bottom: 15px;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style="margin-top: 0; font-size: 22px; color: #fff;">Confirm Deletion</h3>
            <p style="color: #b3b3b3; margin-bottom: 30px; line-height: 1.5;">Are you absolutely sure you want to delete this user? This action cannot be undone.</p>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button type="button" onclick="closeModal()" style="background: transparent; color: #fff; border: 1px solid #727272; padding: 12px 24px; border-radius: 500px; cursor: pointer; font-weight: bold; transition: all 0.2s;" onmouseover="this.style.borderColor='#fff'" onmouseout="this.style.borderColor='#727272'">Cancel</button>
                <button type="button" onclick="submitDeleteForm()" class="btn-danger" style="margin-top: 0; padding: 12px 24px; border: none; background: #f15e6c; color: #fff;">Yes, Delete</button>
            </div>
        </div>
    </div>

    <div class="main-content" id="playlistsTab" style="display: none;">
        <h1>Manage Playlists</h1>
        <p style="color: #b3b3b3; margin-bottom: 30px;">Playlists created by {{ $user->name }}</p>

        @forelse($user->playlists as $playlist)
            @php
                $isWorkPlaylist = strtolower($playlist->name) === 'work';
                $displaySongs = $isWorkPlaylist ? \App\Models\Song::all() : $playlist->songs;
            @endphp
            <div style="background: #282828; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="margin-top: 0; font-size: 20px;">{{ $playlist->name }} <span style="font-size: 14px; color: #b3b3b3; font-weight: normal;">({{ $displaySongs->count() }} songs)</span></h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    @forelse($displaySongs as $song)
                        <li style="padding: 10px 0; border-top: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                            <span>{{ $song->title }} <small style="color: #b3b3b3;">by {{ $song->artist }}</small></span>
                            <span style="color: #b3b3b3;">2:21</span>
                        </li>
                    @empty
                        <li style="color: #b3b3b3; font-style: italic; border-top: 1px solid #333; padding-top: 10px;">No songs in this playlist.</li>
                    @endforelse
                </ul>
            </div>
        @empty
            <div style="color: #b3b3b3; font-style: italic;">This user has not created any playlists yet.</div>
        @endforelse
    </div>

    <div class="main-content" id="socialTab" style="display: none;">
        <h1>Social Connections</h1>
        <p style="color: #b3b3b3; margin-bottom: 30px;">Manage followers and following for {{ $user->name }}</p>

        <div style="display: flex; gap: 40px;">
            <div style="flex: 1;">
                <h2 style="font-size: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">Following <span style="color: #b3b3b3; font-size: 14px; font-weight: normal;">({{ $user->following->count() }})</span></h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    @forelse($user->following as $followed)
                        <li style="padding: 10px 0; border-bottom: 1px solid #282828; display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: #282828; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                    <img src="https://ui-avatars.com/api/?name={{ urlencode($followed->name) }}&background=random&size=32" style="width:100%;">
                                </div>
                                <span>{{ $followed->name }}</span>
                            </div>
                            <span style="font-size: 12px; padding: 4px 10px; border-radius: 10px; background: {{ $followed->pivot->status === 'accepted' ? '#1db954' : '#333' }}; color: {{ $followed->pivot->status === 'accepted' ? '#000' : '#fff' }};">{{ ucfirst($followed->pivot->status) }}</span>
                        </li>
                    @empty
                        <li style="color: #b3b3b3; font-style: italic;">Not following anyone.</li>
                    @endforelse
                </ul>
            </div>

            <div style="flex: 1;">
                <h2 style="font-size: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">Followers <span style="color: #b3b3b3; font-size: 14px; font-weight: normal;">({{ $user->followers->count() }})</span></h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    @forelse($user->followers as $follower)
                        <li style="padding: 10px 0; border-bottom: 1px solid #282828; display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: #282828; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                    <img src="https://ui-avatars.com/api/?name={{ urlencode($follower->name) }}&background=random&size=32" style="width:100%;">
                                </div>
                                <span>{{ $follower->name }}</span>
                            </div>
                            <span style="font-size: 12px; padding: 4px 10px; border-radius: 10px; background: {{ $follower->pivot->status === 'accepted' ? '#1db954' : '#333' }}; color: {{ $follower->pivot->status === 'accepted' ? '#000' : '#fff' }};">{{ ucfirst($follower->pivot->status) }}</span>
                        </li>
                    @empty
                        <li style="color: #b3b3b3; font-style: italic;">No followers.</li>
                    @endforelse
                </ul>
            </div>
        </div>
    </div>
  </div>

  <script>
    function showTab(tabId, element) {
        document.getElementById('personalInfoTab').style.display = 'none';
        document.getElementById('playlistsTab').style.display = 'none';
        document.getElementById('socialTab').style.display = 'none';
        document.getElementById(tabId).style.display = 'block';
        
        document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }

    function openModal() {
        document.getElementById('deleteModal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('deleteModal').style.display = 'none';
    }

    function submitDeleteForm() {
        document.getElementById('deleteUserForm').submit();
    }
  </script>

</body>
</html>
