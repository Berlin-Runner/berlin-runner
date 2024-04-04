class BaseUIComponent {
  constructor(id, context) {
    this.context = context;
    this.stateManager = this.context.gameStateManager;
    this.stateBus = this.context.gameStateEventBus;
    this.scoreManager = this.context.gameScoreManager;
    this.scoreBus = this.context.scoreEventBus;
    this.healthBus = this.context.playerHealthEventBus;
    this.uiComponent = document.getElementById(id);
    this.staticNoise = document.getElementById('page_static');
    // Bind the handler to maintain the correct `this` context when called.
    this.boundAudioMuteToggleHandler = this.handleAudioMuteToggle.bind(this);
    this.setupAudioMuteListener();
  }

  setupAudioMuteListener() {
    document.addEventListener(
      'audioMuteToggle',
      this.boundAudioMuteToggleHandler
    );
  }

  handleAudioMuteToggle(event) {
    // Default implementation does nothing.
    // Subclasses can override this method to update their UI in response to the event.
    // This could involve changing icons/text related to the audio state.
  }

  // Ensure to remove the event listener when the component is destroyed or hidden
  componentWillUnmount() {
    document.removeEventListener(
      'audioMuteToggle',
      this.boundAudioMuteToggleHandler
    );
    // Any additional cleanup should go here.
  }

  hideStatic() {
    this.staticNoise.style.display = 'none';
  }

  showStatic() {
    this.staticNoise.style.display = 'flex';
  }

  hideComponent() {
    this.uiComponent.style.display = 'none';
  }

  showComponent() {
    this.uiComponent.style.display = 'flex';
  }

  listenToEvent(event, callback) {
    this.uiComponent.addEventListener(event, () => {
      callback();
    });
  }
}

export { BaseUIComponent };
