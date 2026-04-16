import { getTimingScoreForMs, calculateBehaviorScore } from '../../shared/verification.js';

export class InteractionTracker {
  constructor() {
    this.questionStartTimes = {};
    this.answerTimes = {};
    this.responseTimes = {};
    this.mouseMovements = [];
    this.hoveredOptionsByQuestion = {};
    this.mouseMoveHandler = null;
    this.containerRef = null;
    this.currentQuestionId = null;
    this.lastMoveTimestamp = 0;
  }

  startQuestion(questionId) {
    this.questionStartTimes[questionId] = Date.now();
    this.currentQuestionId = questionId;
    this.hoveredOptionsByQuestion[questionId] = [];
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
    this.lastMoveTimestamp = 0;

    this.mouseMoveHandler = (e) => {
      const timestamp = Date.now();
      if (timestamp - this.lastMoveTimestamp < 80) return;
      this.lastMoveTimestamp = timestamp;
      if (this.mouseMovements.length >= 250) {
        this.mouseMovements.shift();
      }

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
    return getTimingScoreForMs(this.responseTimes[questionId]);
  }

  getBehaviorScore(questionIds = []) {
    return calculateBehaviorScore(this.getSummary(questionIds), questionIds);
  }

  recordOptionHover(questionId, optionId) {
    if (!questionId) return;
    if (!this.hoveredOptionsByQuestion[questionId]) {
      this.hoveredOptionsByQuestion[questionId] = [];
    }

    if (!this.hoveredOptionsByQuestion[questionId].includes(optionId)) {
      this.hoveredOptionsByQuestion[questionId].push(optionId);
    }
  }

  getSummary(questionIds = []) {
    const uniqueQuestionIds = questionIds.length > 0
      ? questionIds
      : Object.keys(this.responseTimes);
    const hoveredOptionsByQuestion = {};
    uniqueQuestionIds.forEach((questionId) => {
      hoveredOptionsByQuestion[questionId] = this.hoveredOptionsByQuestion[questionId] || [];
    });

    return {
      responseTimes: { ...this.responseTimes },
      hoveredOptionsByQuestion,
      mouseMovements: [...this.mouseMovements],
    };
  }

  reset() {
    this.questionStartTimes = {};
    this.answerTimes = {};
    this.responseTimes = {};
    this.mouseMovements = [];
    this.hoveredOptionsByQuestion = {};
    this.currentQuestionId = null;
    this.lastMoveTimestamp = 0;
  }
}
