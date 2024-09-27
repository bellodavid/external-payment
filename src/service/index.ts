export const Auth = {
  signup: (user) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      user: user,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(
      `https://app.bananacrystal.com/api/users/sign_up`,
      requestOptions
    ).then((response) => response.json());
  },
};
