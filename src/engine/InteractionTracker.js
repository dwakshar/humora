export class InteractionTracker {
  constructor() {
    this.questionStartTimes = {};
    this.answerTimes = {};
    this.responseTimes = {};
    this.mouseMovements = [];
    this.hoveredOptions = [];
    this.mouseMoveHandler = null;
    this.containerRef = null;
  }

  startQuestion(questionId) {
    this.questionStartTimes[questionId] = Date.now();
    this.hoveredOptions = [];
  }

  recordAnswer(questionId, optionId) {
    const answerTime = Date.now();
    this.answerTimes[questionId] = { optionId, timestamp: answerTime };
    if (this.questionStartTimes[questionId]) {
      this.responseTimes[questionId] = answerTime - this.questionStartTimes[questionId];
    }
  }

  startTracking(containerRef) {
    this.containerRef = containerRef;
    this.mouseMovements = [];

    this.mouseMoveHandler = (e) => {
      this.mouseMovements.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    };

    if (containerRef && containerRef.current) {
      containerRef.current.addEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  stopTracking() {
    if (this.containerRef && this.containerRef.current && this.mouseMoveHandler) {
      this.containerRef.current.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    this.mouseMoveHandler = null;
    this.containerRef = null;
  }

  getTimingScore(questionId) {
    const ms = this.responseTimes[questionId];
    if (ms === undefined) return 0;
    if (ms < 300) return 0;
    if (ms <= 800) return 1;
    if (ms <= 4000) return 2;
    if (ms <= 8000) return 1;
    return 0;
  }

  getBehaviorScore() {
    const entropyScore = this._calculateMovementEntropy();
    const hoverScore = this._calculateHoverScore();
    return Math.min(10, Math.round(entropyScore * 7 + hoverScore * 3));
  }

  recordOptionHover(optionId) {
    if (!this.hoveredOptions.includes(optionId)) {
      this.hoveredOptions.push(optionId);
    }
  }

  reset() {
    this.questionStartTimes = {};
    this.answerTimes = {};
    this.responseTimes = {};
    this.mouseMovements = [];
    this.hoveredOptions = [];
  }

  _calculateMovementEntropy() {
    const moves = this.mouseMovements;
    if (moves.length < 3) return 0;

    const angles = [];
    for (let i = 1; i < moves.length - 1; i++) {
      const dx1 = moves[i].x - moves[i - 1].x;
      const dy1 = moves[i].y - moves[i - 1].y;
      const dx2 = moves[i + 1].x - moves[i].x;
      const dy2 = moves[i + 1].y - moves[i].y;
      const angle = Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1);
      angles.push(angle);
    }

    const mean = angles.reduce((sum, a) => sum + a, 0) / angles.length;
    const variance = angles.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / angles.length;
    const entropy = Math.min(1, variance / (Math.PI * Math.PI));

    return entropy;
  }

  _calculateHoverScore() {
    const count = this.hoveredOptions.length;
    if (count === 0) return 0;
    if (count === 1) return 0.3;
    if (count === 2) return 0.7;
    return 1;
  }
}