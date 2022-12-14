import {CartService} from './../services/cart.service';
import {Router} from '@angular/router';
import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ToastrService} from 'ngx-toastr';

declare let $: any;

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLogin: boolean = false;
  userData: any = {};
  userName: string = '';
  userRole: string = ''

  cartItems: any;
  cartLength: any;
  cartSubTotal: any;

  dashboard: boolean = true;
  cartProducts: any[] = [];
  private currentUserSubscription: any;
  private cartDataSubs: any;
  private cartProductsSubs: any;
  private cartSubTotalSubs: any;
  private cartItemsLengthSubs: any;

  constructor(private _AuthService: AuthService, public _Router: Router, private _CartService: CartService, private _ToastrService: ToastrService) {
    this.userRole = this._AuthService.userRole;

    this.currentUserSubscription = this._AuthService.currentUserData.subscribe((currentData: any) => {
      if (currentData) {
        this.isLogin = true;
        if (localStorage.getItem('updatedData')) // updated profile data
        {
          this.userData = currentData;
          this.userName = this.userData.name;
        }
        this.userData = currentData;
        this.userName = this.userData.name;
      } else {
        this.isLogin = false;
      }
    })

    this.showCartData()
  }

  ngOnDestroy(): void {
    this._AuthService.currentUserData.next(null)
    // this.currentUserSubscription.unsubscribe();

    this._CartService.cartData.next(null) // clear cart data
    // this.cartDataSubs.unsubscribe();

    this._CartService.cartSubTotalValue.next('00.0')
    // this.cartSubTotalSubs.unsubscribe();

    this._CartService.cartItemsLength.next(null)
    // this.cartItemsLengthSubs.unsubscribe();
  }

  logout() {
    localStorage.clear();

    this._AuthService.currentUserData.next(null)
    // this.currentUserSubscription.unsubscribe();

    this._CartService.cartData.next(null) // clear cart data
    // this.cartDataSubs.unsubscribe();

    this._CartService.cartSubTotalValue.next('00.0')
    // this.cartSubTotalSubs.unsubscribe();

    this._CartService.cartItemsLength.next(null)
    // this.cartItemsLengthSubs.unsubscribe();

    this.isLogin = false;
    this._Router.navigate(['/login']);
  }
  showCartData() {
    this.cartDataSubs = this._CartService.cartData.subscribe((resp: any) => {
      this.cartItems = resp
    })

    this.cartProductsSubs = this._CartService.cartProductsData.subscribe((resp: any) => {
      this.cartProducts = resp;
    })

    this.cartItemsLengthSubs = this._CartService.cartItemsLength.subscribe((resp: any) => {
      this.cartLength = resp
    })

    this.cartSubTotalSubs = this._CartService.cartSubTotalValue.subscribe((resp: any) => {
      this.cartSubTotal = resp
    })

  }

  deleteItem(itemId:any)
  {
    this._CartService.removeFromCart(itemId).subscribe((resp)=>
    {
      this._CartService.showCartData();
      this._ToastrService.success('Item successfully deleted.')
    })
  }

  profile_Dropdwon()
  {
    if($('#profile_menu li').css('opacity') != 0)
    {
      $('#profile_menu li').css('opacity', '0');
      $('.action').animate({bottom:'0px',opacity: '0',height:'0px'}, 'fast');
      $('.action').css('display', 'none');
    }
    else
    {
      $('.action').css({'bottom': '', 'display':'block', 'height':''});
      $('#profile_menu li').css('opacity', '1');
      $('.action').animate({opacity: '1'}, 'fast');
    }
  }

  sideBar()
  {
    $('.fa-bag-shopping').removeClass('fa-bounce');

    if( $("#sideBar").css("right") =="-320px" ) //when sidebar inside
    {
      $(".sideBar_lightbox").css("display", 'block');
      $(".sideBar").css("right", '0px');
    }
    else //when sidebar outside
    {
      $(".sideBar_lightbox").css("display", 'none');
      $(".sideBar").css("right", '-320px');
    }
  }

  closeSideBar()
  {
    $('.fa-bag-shopping').removeClass('fa-bounce');
    $(".sideBar").css("right", '-320px');
    $(".sideBar_lightbox").css("display", 'none');
  }

  ngOnInit(): void {
    $('#menu-bar').click(function()
    {
      var menu:any = document.getElementById("menu");
      if( $("#menu").css("left") =="500px" ) //when sidebar inside
      {
          menu.style.left = "180px"  ;
          $('#menu-bar').addClass('fas fa-times');
      }
      else //when sidebar outside
      {
        menu.style.left = "500px"    ;
        $('#menu-bar').removeClass('fas fa-times');
        $('#menu-bar').addClass('fas fa-bars');
      }
    });


    $('.icon').click(function()
    {
      console.log('hello');

      if( $("#sideBar").css("width") =="0px" ) //when sidebar inside
      {
        $(".sideBar_lightbox").css("display", 'block');
        $(".sideBar").css("width", '320px');
      }
      else //when sidebar outside
      {
        $(".sideBar_lightbox").css("display", 'none');
        $(".sideBar").css("width", '0px');
      }
    });



    // $(".sideBar_lightbox").on('click', closeSideBar);
    // $("#close-bar").on('click', closeSideBar);

  }

}
