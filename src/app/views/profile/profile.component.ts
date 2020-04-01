import { Component, OnInit, OnDestroy } from '@angular/core';
import { faSignOutAlt, fas } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'src/app/services/account.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
// import { Groups } from 'src/app/shared/account.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userProfile = null;
  user$: Observable<any>;
  uid: string;
  groups = [];
  categories = [];
  profileForm: FormGroup;
  groupForm: FormGroup;
  categoryForm: FormGroup;
  profileEdit = false;
  groupsEdit = false;
  categoryEdit = false;
  currencies = [];
  editedGroup: string;
  iconSignOutAlt = faSignOutAlt;

  subscribeGroup: Subscription;
  subscribeProfile: Subscription;
  subscribeCategory: Subscription;

  constructor(
    private accountService: AccountService,
    public auth: AngularFireAuth,
    private fb: FormBuilder,
    public alertService: AlertService,
    private configService: ConfigService,
    private router: Router,
    public authService: AuthService
    ) {
      this.user$ = this.authService.user$;

    }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.loadProfile();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.subscribeGroup.unsubscribe();
    this.subscribeProfile.unsubscribe();
    this.subscribeCategory.unsubscribe();
  }

  loadProfile() {
    this.subscribeProfile = this.accountService.getUserProfile().subscribe(profile => {
        this.userProfile = profile;
      });
    this.subscribeGroup = this.accountService.getGroups().subscribe(groups => {
        this.groups = groups;
      });
    this.loadCategories();
    this.loadCurrencies();
      // Preset Profil Form
    this.profileForm = this.fb.group({
        name: ['', [
          Validators.required
        ]],
        email: ['', [
          Validators.required
        ]],
        currency: ['', [
          Validators.required
        ]],
        country: ['', [
          Validators.required
        ]]
      });
      // Preset Group Form
    this.groupForm = this.fb.group({
        name: ['', [
          Validators.required
        ]],
        id: ['', []]
      });
      // Preset Category Form
    this.categoryForm = this.fb.group({
        name: ['', [
          Validators.required
        ]]
      });
    }


  editProfile() {
    this.profileForm.patchValue(this.userProfile);
    this.profileEdit = true;
  }

  loadCategories() {
    this.subscribeCategory = this.accountService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadCurrencies() {
    this.configService.loadCurrencies().pipe(take(1)).subscribe(curr => {
      this.currencies = curr;
    });
  }



  // GROUP functions
  addGroup() {
    this.groupsEdit = true;
  }

  editGroup(group) {
    this.groupsEdit = true;
    this.editedGroup = group;
    this.groupForm.patchValue(group);
  }

  cancelAddGroup() {
    this.groupsEdit = false;
  }

  async saveGroup() {
    if (this.groupForm.valid) {
      console.log(this.groupForm.value);
      try {
        if (this.editedGroup) {
          this.accountService.updateGroup(this.groupForm.value);
        } else {
          this.accountService.saveGroup(this.groupForm.value);
        }
        this.groupsEdit = false;
        this.alertService.success('Profile saved.');
        this.editedGroup = null;
      } catch (err) {
        console.error(err);
        this.alertService.error(err);
      }
    } else {
      this.alertService.error('Form incomplete.');
    }
  }

  async deleteGroup() {
    console.log(this.editedGroup);
    if (this.editedGroup) {
      try {
        this.accountService.deleteGroup(this.editedGroup);
        this.groupsEdit = false;
        this.alertService.success('Group deleted.');

        this.editedGroup = null;
      } catch (err) {
        console.error(err);
        this.alertService.error(err);
      }
    }
  }

  // CATEGORY functions
  addCategory() {
    this.categoryEdit = true;
  }

  cancelAddCategory() {
    this.categoryEdit = false;
  }

  async saveCategory() {
    if (this.categoryForm.valid) {
      try {
        this.accountService.saveCategory(this.categoryForm.value);
        this.categoryEdit = false;
        this.alertService.success('Category saved.');
        this.categoryForm.reset();
      } catch (err) {
        console.error(err);
        this.alertService.error(err);
      }
    } else {
      this.alertService.error('Form incomplete.');
    }
  }

  deleteCategory(category) {
    console.log(category);
    if (category) {
      try {
        this.accountService.deleteCategory(category);
        this.alertService.success('Category deleted.');
        this.loadCategories();
      } catch (err) {
        console.error(err);
        this.alertService.error(err);
      }
    }
  }

  async onSubmitProfile() {
    if (this.profileForm.valid) {
      try {
        this.accountService.saveProfile(this.profileForm.value);
        this.profileEdit = false;
        this.alertService.success('Profile saved.');
      } catch (err) {
        console.error(err);
        this.alertService.error(err);
      }
    } else {
      this.alertService.error('Form incomplete.');
    }
  }

  logout() {
    this.auth.auth.signOut();
    this.router.navigate(['/']);
  }

  deleteAccount() {
    const user = this.auth.auth.currentUser;
    user.delete().then(function() {
      // User deleted.
      this.alertService.error('Account DELETED');
    }).catch(function(error) {
      // An error happened.
      this.alertService.error('ERROR', error);
    });
  }

}
