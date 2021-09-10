let instance = null

/**
 * Class to work with sessionStorage
 *
 * @type {null}
 */
class SessionStorage {
  /**
   * @return {null}
   */
  constructor() {
    // if (!process.client) return
    console.log(process.client)
    console.log(process)

    if (!instance) {
      instance = this
      this._isSessionStorage =
        typeof sessionStorage === "object" && sessionStorage
    }

    return instance
  }

  /**
   * Set config to local storage
   *
   * @param {String} key
   * @param {*} value
   */
  set(key, value) {
    if (this._isSessionStorage) {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
  }

  /**
   * Get from local storage
   *
   * @param {String} key
   * @returns {*}
   */
  get(key) {
    let value = null

    if (this._isSessionStorage) {
      try {
        value = JSON.parse(sessionStorage.getItem(key))
      } catch (e) {}
    }

    return value
  }

  remove(key) {
    if (this._isSessionStorage) sessionStorage.removeItem(key)
  }

  setTrackingData(barcode, postcode) {
    if (this._isSessionStorage) {
      this.set("trackingData", {
        barcode,
        postcode,
        timestamp: +new Date(),
      })
    }
  }

  getTrackingData() {
    if (this._isSessionStorage) {
      const trackingData = this.get("trackingData")

      if (!trackingData) return

      const time = 15 * 60 * 1000 // 15 minutes
      const fresh = +new Date() - trackingData.timestamp < time

      return fresh
        ? {
            barcode: trackingData.barcode,
            postcode: trackingData.postcode,
          }
        : ""
    }
  }

  purgeTrackingData() {
    if (this._isSessionStorage) {
      const trackingData = sessionStorage.get("trackingData")

      if (!trackingData) return

      const time = 15 * 60 * 1000 // 15 minutes
      const fresh = +new Date() - trackingData.timestamp < time

      if (!fresh) this.remove("trackingData")
    }
  }
}

(function () {
  // const hermesSessionStorage = new SessionStorage()

  if (process.client) {
    window.hermesSessionStorage = new SessionStorage()
  }
})();
