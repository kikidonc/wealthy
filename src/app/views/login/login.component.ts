import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  signupForm: FormGroup;
  signinForm: FormGroup;
  countries = [];
  currencies = [];

  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;

  serverMessage: string;

  constructor(
    private router: Router,
    public authService: AuthService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private configService: ConfigService,
    private alertsService: AlertService) {
    }

  ngOnInit() {
        // Preset Asset Form
        this.signupForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: [
            '',
            [Validators.minLength(6), Validators.required]
          ],
          passwordConfirm: ['', []],
          name: ['', [
            Validators.required
          ]],
          currency: ['', [
            Validators.required
          ]],
          age: ['', [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(2),
            Validators.maxLength(3)
          ]],
          country: ['', [
            Validators.required
          ]]
        });

        // Preset Asset Form
        this.signinForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: [
            '',
            [Validators.minLength(6), Validators.required]
          ]
        });

        // Load Countries
        this.configService.loadCountries().pipe(take(1)).subscribe(data => {
          this.countries = data;
        });
        // Load currencies
        this.configService.loadCurrencies().pipe(take(1)).subscribe(data => {
          this.currencies = data;
        });
      }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }

  get passwordConfirm() {
    return this.signupForm.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if (this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmitLogin() {
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset) {
        await this.afAuth.auth.sendPasswordResetEmail(email);
        this.alertsService.error('Check your email');
      }
    } catch (err) {
      this.serverMessage = err;
    }
    this.loading = false;
  }

  async onSubmitSignup() {
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;

    const profile = {
      email: email,
      age: this.signupForm.get('age').value,
      country: this.signupForm.get('country').value,
      name: this.signupForm.get('name').value,
      currency: this.signupForm.get('currency').value,
      life: 100 - Number(this.signupForm.get('age').value)
    };
    console.log('SUBMIT SIGNUP - THEN:', profile);
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => {
        console.log('SUBMIT SIGNUP - THEN:', user);
        this.authService.createProfile(profile);
        this.afterSignIn();
      });
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }

  async afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    console.log('afterSignIn', this.authService.user$);
    return this.router.navigate(['/assets']);
  }

  public signOut() {
    return this.authService.signOut();
  }
}
