<script>
export default {
  setup() {
    return {
      dealsStatus: [
        {
          id: 1,
          name: "Absternet LLC",
          date: "Sep 20, 2021",
          img: require("@/assets/images/users/avatar-1.jpg"),
          representativeName: "Donald Risher",
          badgeClass: "success",
          status: "Deal Won",
          statusValue: "$100.1K",
        },
        {
          id: 2,
          name: "Raitech Soft",
          date: "Sep 23, 2021",
          img: require("@/assets/images/users/avatar-2.jpg"),
          representativeName: "Sofia Cunha",
          badgeClass: "warning",
          status: "Intro Call",
          statusValue: "$150K",
        },
        {
          id: 3,
          name: "William PVT",
          date: "Sep 27, 2021",
          img: require("@/assets/images/users/avatar-3.jpg"),
          representativeName: "Luis Rocha",
          badgeClass: "danger",
          status: "Stuck",
          statusValue: "$78.18K",
        },
        {
          id: 4,
          name: "Loiusee LLP",
          date: "Sep 30, 2021",
          img: require("@/assets/images/users/avatar-4.jpg"),
          representativeName: "Vitoria Rodrigues",
          badgeClass: "success",
          status: "Deal Won",
          statusValue: "$180K",
        },
        {
          id: 5,
          name: "Apple Inc.",
          date: "Sep 30, 2021",
          img: require("@/assets/images/users/avatar-6.jpg"),
          representativeName: "Vitoria Rodrigues",
          badgeClass: "primary",
          status: "New Lead",
          statusValue: "$78.9K",
        },
      ],
    };
  },
};
</script>

<template>
  <b-card no-body>
    <b-card-header class="align-items-center d-flex">
      <b-card-title class="mb-0 flex-grow-1">Deals Status</b-card-title>
      <div class="flex-shrink-0">
        <div class="dropdown card-header-dropdown">
          <b-link class="text-reset dropdown-btn" href="#" data-bs-toggle="dropdown" aria-haspopup="true"
            aria-expanded="false">
            <span class="text-muted">02 Nov 2021 to 31 Dec 2021<i class="mdi mdi-chevron-down ms-1"></i></span>
          </b-link>
          <div class="dropdown-menu dropdown-menu-end">
            <b-link class="dropdown-item" href="#">Today</b-link>
            <b-link class="dropdown-item" href="#">Last Week</b-link>
            <b-link class="dropdown-item" href="#">Last Month</b-link>
            <b-link class="dropdown-item" href="#">Current Year</b-link>
          </div>
        </div>
      </div>
    </b-card-header>

    <b-card-body>
      <div class="table-responsive table-card">
        <table class="table table-borderless table-hover table-nowrap align-middle mb-0">
          <thead class="table-light">
            <tr class="text-muted">
              <th scope="col">Name</th>
              <th scope="col" style="width: 20%">Last Contacted</th>
              <th scope="col">Sales Representative</th>
              <th scope="col" style="width: 16%">Status</th>
              <th scope="col" style="width: 12%">Deal Value</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) of dealsStatus" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.date }}</td>
              <td><img :src="`${item.img}`" alt="" class="avatar-xs rounded-circle me-2" />
                <b-link href="#javascript: void(0);" class="text-body fw-medium">{{ item.representativeName }}</b-link>
              </td>
              <td>
                <span :class="'badge badge-soft-' + item.badgeClass + ' p-2'">{{ item.status }}</span>
              </td>
              <td>
                <div class="text-nowrap">{{ item.statusValue }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-card-body>
  </b-card>
</template>
