<script>
  import NavBar from "@/components/nav-bar";
  import RightBar from "@/components/right-bar";
  import Footer from "@/components/footer";
  import {
    StarIcon, Navigation2Icon, AwardIcon, UserIcon, ActivityIcon, BellIcon, MoveIcon
  } from "@zhuowenli/vue-feather-icons";


export default {
  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onRoutechange(ele) {
      this.initActiveMenu(ele.path);
    },
    initActiveMenu(ele) {
      setTimeout(() => {
        if (document.querySelector("#navbar-nav")) {
          let a = document
            .querySelector("#navbar-nav")
            .querySelector('[href="' + ele + '"]');

          if (a) {
            a.classList.add("active");
            let parentCollapseDiv = a.closest(".collapse.menu-dropdown");
            if (parentCollapseDiv) {
              parentCollapseDiv.classList.add("show");
              parentCollapseDiv.parentElement.children[0].classList.add(
                "active"
              );
              parentCollapseDiv.parentElement.children[0].setAttribute(
                "aria-expanded",
                "true"
              );
              if (
                parentCollapseDiv.parentElement.closest(
                  ".collapse.menu-dropdown"
                )
              ) {
                parentCollapseDiv.parentElement
                  .closest(".collapse")
                  .classList.add("show");
                if (
                  parentCollapseDiv.parentElement.closest(".collapse")
                    .previousElementSibling
                )
                  parentCollapseDiv.parentElement
                    .closest(".collapse")
                    .previousElementSibling.classList.add("active");
                }
              }
            }
          }
        }, 1000);
      },
    },
    components: {
      NavBar,
      RightBar,
      Footer,
      StarIcon,
      MoveIcon,
      Navigation2Icon,
      AwardIcon,
      UserIcon,
      ActivityIcon,
      BellIcon
    },
  };
</script>

<template>
  <div>
    <div id="layout-wrapper">
      <NavBar />
      <!-- ========== App Menu ========== -->
      <div class="app-menu navbar-menu">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <!-- Dark Logo-->
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo-sm.png" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt="" height="17" />
            </span>
          </router-link>
          <!-- Light Logo-->
          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo-sm.png" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-light.png" alt="" height="17" />
            </span>
          </router-link>
          <button type="button" class="
              btn btn-sm
              p-0
              fs-20
              header-item
              float-end
              btn-vertical-sm-hover
            " id="vertical-hover">
            <i class="ri-record-circle-line"></i>
          </button>
        </div>
        <div id="scrollbar">
          <b-container fluid>
            <ul class="navbar-nav h-100" id="navbar-nav">
              <li class="menu-title">
                <span data-key="t-menu"> {{ $t("t-menu") }}</span>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/bots">
                  <AwardIcon></AwardIcon>
                  <span data-key="t-landing">Bots</span>
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/trades">
                  <ActivityIcon></ActivityIcon>
                  <span data-key="t-landing">Trades</span>
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/signals">
                  <BellIcon></BellIcon>
                  <span data-key="t-landing">Signals</span>
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/bonds">
                  <MoveIcon></MoveIcon>
                  <span data-key="t-landing">Bonds</span>
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/strategies">
                  <StarIcon></StarIcon>
                  <span data-key="t-landing">Strategies</span>
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/indicators">
                  <Navigation2Icon></Navigation2Icon>
                  <span data-key="t-landing">Indicators</span>
                </a>
              </li>

              <li class="nav-item">
                <a class="nav-link menu-link" href="/exchange-accounts">
                  <UserIcon></UserIcon>
                  <span data-key="t-landing">Exchange Accounts</span>
                </a>
              </li>

            </ul>
          </b-container>
          </div>
          <!-- Sidebar -->
        </div>
        <!-- Left Sidebar End -->
        <!-- Vertical Overlay-->
        <div class="vertical-overlay"></div>
      </div>
      <!-- ============================================================== -->
      <!-- Start Page Content here -->
      <!-- ============================================================== -->

      <div class="main-content">
        <div class="page-content">
          <!-- Start Content-->
          <b-container fluid>
            <slot />
          </b-container>
        </div>
        <Footer />
      </div>
      <RightBar />
    </div>

</template>