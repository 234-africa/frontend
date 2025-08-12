<template>
  <div>
    <div class="content-body">
      <div class="container-fluid">
        <div class="row page-titles mx-0">
          <div class="col-sm-6 p-md-0">
            <div class="welcome-text">
              <h4>Hi, welcome back!</h4>
              <span>Email</span>
            </div>
          </div>
          <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="javascript:void(0)">Email</a></li>
              <li class="breadcrumb-item active"><a href="javascript:void(0)">Compose</a></li>
            </ol>
          </div>
        </div>
        <!-- row -->
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <div class="email-left-box px-0 mb-3">
                  <div class="p-0">
                    <a class="btn btn-primary btn-block">Compose</a>
                  </div>
                  <div class="mail-list mt-4">
                    <a
                      :class="{
                      'bg-primary ': isInboxVisible,
                      grey: !isInboxVisible,
                    }"
                      @click="onClickInboxTab()"
                      class=" "
                    ><i class="fa fa-inbox font-18 align-middle mr-2"></i> Inbox <span class="badge badge-primary badge-sm float-right">198</span> </a>
                    <a
                      :class="{
                        'bg-primary ': isSentVisible,
                      grey: !isSentVisible,
                    }"
                      @click="onClickSentTab()"
                      class=""
                    ><i class="fa fa-paper-plane font-18 align-middle mr-2"></i>Sent</a> <a
                      :class="{
                        'bg-primary ': isImportantVisible,
                      grey: !isImportantVisible,
                    }"
                      @click="onClickImportantTab()"
                      class=""
                    ><i class="fa fa-star-o font-18 align-middle mr-2"></i>Important <span class="badge badge-danger text-white badge-sm float-right">47</span>
                    </a>
                    <a
                      :class="{
                        'bg-primary ': isDraftVisible,
                      grey: !isDraftVisible,
                    }"
                      @click="onClickDraftTab()"
                      class=""
                    ><i class="mdi mdi-file-document-box font-18 align-middle mr-2"></i>Draft</a><a
                      :class="{
                      'bg-primary ': isTrashVisible,
                      grey: !isTrashVisible,
                    }"
                      @click="onClickTrashTab()"
                      class=""
                    ><i class="fa fa-trash font-18 align-middle mr-2"></i>Trash</a>
                  </div>
                  <div class="intro-title d-flex justify-content-between">
                    <h5>Categories</h5>
                    <i
                      class="fa fa-chevron-down"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div class="mail-list mt-4">
                    <a
                      href="email-inbox.html"
                      class=""
                    ><span class="icon-warning"><i
                          class="fa fa-circle"
                          aria-hidden="true"
                        ></i></span>
                      Work </a>
                    <a
                      href="email-inbox.html"
                      class=""
                    ><span class="icon-primary"><i
                          class="fa fa-circle"
                          aria-hidden="true"
                        ></i></span>
                      Private </a>
                    <a
                      href="email-inbox.html"
                      class=""
                    ><span class="icon-success"><i
                          class="fa fa-circle"
                          aria-hidden="true"
                        ></i></span>
                      Support </a>
                    <a
                      href="email-inbox.html"
                      class=""
                    ><span class="icon-dpink"><i
                          class="fa fa-circle"
                          aria-hidden="true"
                        ></i></span>
                      Social </a>
                  </div>
                </div>
                <div class="email-right-box ml-0 ml-sm-4 ml-sm-0">
                  <div>
                    <Inbox v-if="isInboxVisible"></Inbox>
                  </div>
                  <div>
                    <Important v-if="isImportantVisible"></Important>
                  </div>
                  <div>
                    <Sent v-if="isSentVisible"></Sent>
                  </div>
                  <div>
                    <Draft v-if="isDraftVisible"></Draft>
                  </div>
                  <div>
                    <Trash v-if="isTrashVisible"></Trash>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

//import Trash from "./email/trash.vue";

export default {
  components: {

  //  Trash
  },
  data() {
    return {
      isSentVisible: false,
      isInboxVisible: true,
      isReadVisible: false,
      isImportantVisible: false,
      isTrashVisible: false
    };
  },

  methods: {
    hideAll() {
      this.isInboxVisible = false;
      this.isImportantVisible = false;
      this.isSentVisible = false;
      this.isDraftVisible = false;
      this.isTrashVisible = false;
    },
    onClickHomeTab() {
      this.hideAll();
      this.isAccountHomeVisible = true;
      //this.mobileTab = "Dashboard";
    },
    onClickProfileTab() {
      this.hideAll();
      this.isProfileVisible = true;
      //this.mobileTab = "Dashboard";
    },
    onClickTrashTab() {
      this.hideAll();
      this.isTrashVisible = true;
      //this.mobileTab = "Dashboard";
    },
    onClickDraftTab() {
      this.hideAll();
      this.isDraftVisible = true;
    },
    onClickImportantTab() {
      this.hideAll();
      this.isImportantVisible = true;
      //  this.mobileTab = "Calendar";
    },
    onClickSentTab() {
      this.hideAll();
      this.isSentVisible = true;
      //  this.mobileTab = "Calendar";
    },

    onClickInboxTab() {
      this.hideAll();
      this.isInboxVisible = true;
      //  this.mobileTab = "Calendar";
    },
    onClickTab() {
      if (this.mobileTab == "Dashboard") {
        this.onClickHomeTab();
      } else if (this.mobileTab == "Wallet") {
        this.onClickWalletTab();
      }
    },
    initialize() {
      if (err) {
        if (this.activeTab == "inbox") {
          this.onClickInboxTab();
        } else if (this.activeTab == "sent") {
          this.onClickSentTab();
        } else if (this.activeTab == "important") {
          this.onClickImportantTab();
        } else if (this.activeTab == "draft") {
          this.onClickDraftTab();
        } else if (this.activeTab == "trash") {
          this.onClickTrashTab();
        } else {
          this.onClickInboxTab();
        }
      }
    }
  },
  mounted() {
    this.initialize();
  }
};
</script>
