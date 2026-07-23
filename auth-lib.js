(function(){
  const SUPABASE_URL = 'https://ilfxyvsqintvjbifqxvr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZnh5dnNxaW50dmpiaWZxeHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NDg4NjYsImV4cCI6MjA5ODEyNDg2Nn0.GxeTD1GlBDmmVsoCgXZPKnp02GDL42ncrWsjegN2B6o';
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const MN_AUTH = {
    client: sb,
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    companyId: null,
    companyName: null,
    accessToken: null,
    apiHeaders: function(){
      return {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + (this.accessToken || SUPABASE_ANON_KEY),
        'Content-Type': 'application/json'
      };
    },
    logout: async function(){ await sb.auth.signOut(); location.reload(); }
  };
  window.MN_AUTH = MN_AUTH;

  function injectStyles(){
    if (document.getElementById('mnauth-style')) return;
    const css = ".mnauth-overlay{position:fixed;inset:0;z-index:99999;background:linear-gradient(160deg,#12293B,#0A1420);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;padding:20px;}"
      + ".mnauth-box{width:100%;max-width:340px;background:#fff;border-radius:20px;padding:30px 26px;box-shadow:0 20px 50px -20px rgba(0,0,0,.4);box-sizing:border-box;}"
      + ".mnauth-ic{width:52px;height:52px;border-radius:15px;background:#2FB6A8;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 16px;color:#fff;}"
      + ".mnauth-box h2{font-size:19px;text-align:center;margin:0;font-family:'Manrope',sans-serif;font-weight:800;color:#16202A;}"
      + ".mnauth-box p{color:#5C6B75;font-size:13px;text-align:center;margin-top:6px;}"
      + ".mnauth-box input{width:100%;margin-top:14px;border:1px solid #E7ECEE;border-radius:12px;padding:12px 14px;font-size:14.5px;font-family:inherit;box-sizing:border-box;}"
      + ".mnauth-box button.primary{width:100%;margin-top:16px;background:#2FB6A8;color:#fff;border:none;border-radius:999px;padding:13px;font-weight:800;font-size:14.5px;cursor:pointer;}"
      + ".mnauth-msg{margin-top:12px;font-size:12.5px;text-align:center;color:#E15B4E;min-height:16px;}";
    const style = document.createElement('style');
    style.id = 'mnauth-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildOverlay(mode){
    const old = document.getElementById('mnauthOverlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.className = 'mnauth-overlay';
    overlay.id = 'mnauthOverlay';
    if (mode === 'setpass'){
      overlay.innerHTML =
        '<div class="mnauth-box">' +
          '<div class="mnauth-ic">\uD83D\uDD11</div>' +
          '<h2>\u041F\u0440\u0438\u0434\u0443\u043C\u0430\u0439\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</h2>' +
          '<p>\u042D\u0442\u043E \u0432\u0430\u0448 \u043F\u0435\u0440\u0432\u044B\u0439 \u0432\u0445\u043E\u0434 \u2014 \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C</p>' +
          '<input type="password" id="mnauthNewPass" placeholder="\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C (\u043C\u0438\u043D. 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432)">' +
          '<input type="password" id="mnauthNewPass2" placeholder="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C">' +
          '<button class="primary" id="mnauthSetBtn">\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438 \u0432\u043E\u0439\u0442\u0438</button>' +
          '<div class="mnauth-msg" id="mnauthMsg"></div>' +
        '</div>';
    } else {
      overlay.innerHTML =
        '<div class="mnauth-box">' +
          '<div class="mnauth-ic">\uD83D\uDD10</div>' +
          '<h2>\u0412\u0445\u043E\u0434 \u0432 \u043F\u0430\u043D\u0435\u043B\u044C</h2>' +
          '<p>\u041B\u0438\u0447\u043D\u044B\u0439 \u043A\u0430\u0431\u0438\u043D\u0435\u0442 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438</p>' +
          '<input type="email" id="mnauthEmail" placeholder="Email">' +
          '<input type="password" id="mnauthPassword" placeholder="\u041F\u0430\u0440\u043E\u043B\u044C">' +
          '<button class="primary" id="mnauthLoginBtn">\u0412\u043E\u0439\u0442\u0438</button>' +
          '<div class="mnauth-msg" id="mnauthMsg"></div>' +
        '</div>';
    }
    document.body.appendChild(overlay);
    return overlay;
  }

  async function loadProfile(){
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const { data: profile } = await sb.from('profiles').select('*, companies(name)').eq('user_id', user.id).maybeSingle();
    return profile;
  }

  MN_AUTH.init = function(onReady){
    injectStyles();
    const hash = window.location.hash;
    const isInviteOrRecovery = hash.indexOf('type=invite') !== -1 || hash.indexOf('type=recovery') !== -1;

    async function proceedReady(session){
      MN_AUTH.accessToken = session.access_token;
      const profile = await loadProfile();
      if (!profile){
        showLogin('\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u0432 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443.');
        return;
      }
      MN_AUTH.companyId = profile.company_id;
      MN_AUTH.companyName = (profile.companies && profile.companies.name) || '\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F';
      const ov = document.getElementById('mnauthOverlay');
      if (ov) ov.remove();
      onReady(MN_AUTH);
    }

    function showLogin(errMsg){
      buildOverlay('login');
      if (errMsg) document.getElementById('mnauthMsg').textContent = errMsg;
      document.getElementById('mnauthLoginBtn').onclick = async function(){
        const email = document.getElementById('mnauthEmail').value.trim();
        const password = document.getElementById('mnauthPassword').value;
        const msg = document.getElementById('mnauthMsg');
        msg.textContent = '';
        const { data, error } = await sb.auth.signInWithPassword({ email: email, password: password });
        if (error){ msg.textContent = '\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 email \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C'; return; }
        await proceedReady(data.session);
      };
    }

    function showSetPassword(){
      buildOverlay('setpass');
      document.getElementById('mnauthSetBtn').onclick = async function(){
        const p1 = document.getElementById('mnauthNewPass').value;
        const p2 = document.getElementById('mnauthNewPass2').value;
        const msg = document.getElementById('mnauthMsg');
        msg.textContent = '';
        if (p1.length < 6){ msg.textContent = '\u041F\u0430\u0440\u043E\u043B\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432'; return; }
        if (p1 !== p2){ msg.textContent = '\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442'; return; }
        const { error } = await sb.auth.updateUser({ password: p1 });
        if (error){ msg.textContent = '\u041E\u0448\u0438\u0431\u043A\u0430: ' + error.message; return; }
        history.replaceState(null, '', window.location.pathname);
        const { data: sdata } = await sb.auth.getSession();
        await proceedReady(sdata.session);
      };
    }

    (async function(){
      if (isInviteOrRecovery){
        sb.auth.onAuthStateChange(function(event, session){
          if (session) showSetPassword();
        });
        showSetPassword();
      } else {
        const { data } = await sb.auth.getSession();
        if (data.session){ await proceedReady(data.session); }
        else { showLogin(); }
      }
    })();
  };
})();
