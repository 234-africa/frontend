<template>
  <div class="col-sm-8">
    <!-- Existing content -->

    <button
      class="a-button-text btn"
      @click="openModa"
    >Open Modal</button>

    <div
      v-if="isModalOpe"
      class="modal-overlay"
    >
      <div class="modal-container">
        <!-- Modal content -->
        <div class="custom-modal">
          <div class="a-spacing-top-medium">
            <h1 class="a-spacing-base">
              <b>Create Review</b>
            </h1>
            <div class="row">

            </div>
            <div class="a-spacing-top-medium"></div>
            <hr>
            <h4>{{ productTitle }}</h4>

            <h2 class="a-spacing-base">Overall Rating</h2>
            <div class="a-row">
              <!-- Rating -->
              <star-rating v-model="rating"></star-rating>
            </div>
            <div class="a-row a-spacing-top-large">

            </div>
            <div class="a-row a-spacing-top-medium">

            </div>
            <div class="a-spacing-top-large"></div>
            <hr>
            <!-- Headline -->
            <div class="headline a-spacing-large">
              <h2 class="a-spacing-base">Add a headline</h2>
              <input
                type="text "
                class="a-input-text form-control"
                style="width: 70%;"
                placeholder="What's most important to know?"
                v-model="headline"
              >
            </div>
            <!-- Body -->
            <div class="a-spacing-base">
              <h2 class="a-spacing-base">Write your review</h2>
              <textarea
                class="form-control"
                placeholder="What do you like or dislike? What did you see this product for?"
                style="height:6em; width: 100%;"
                v-model="body"
              ></textarea>
            </div>
          </div>

          <hr>
          <div class="a-spacing-top-medium">
            <p style="font-size: 14px; font-weight: 700;">This is how you'll appear to other customers:</p>
            <div class="media a-spacing-top-large">
              <div class="media-left">
                <img
                  src="/img/avatar.png"
                  class="img-fluid"
                  style="width: 50px;"
                >
              </div>
              <div class="media-body pl-3 pt-2">
                <input
                  type="text"
                  class="a-input-text form-control"
                  style="width: 100%;"
                  :value="name"
                >
              </div>
            </div>
          </div>
          <div class="a-row a-spacing-top-medium">
            <span class="a-color-tertiary">Don't worry, you can always change this on your profile</span>
          </div>
          <div class="a-row text-right a-spacing-top-large">
            <button
              class="btn-primary border-1 btn-sm"
              @click="onAddReview"
            >Submit</button>
          </div>
        </div>
        <button
          class="modal-close-btn btn-danger"
          @click="closeModa"
        >X</button>
      </div>

    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isModalOpe = ref(false);

    const openModa = () => {
      isModalOpe.value = true;
    };

    const closeModa = () => {
      isModalOpe.value = false;
    };

    return {
      isModalOpe,
      openModa,
      closeModa
    };
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-modal {
  /* Add your custom modal styles here */
}
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.modal-close-btn {
  margin-top: 10px;
}
</style>
