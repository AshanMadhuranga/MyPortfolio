export type WorldSection = 'home' | 'about' | 'skills' | 'projects' | 'journey' | 'terminal' | 'contact'
export type WorldStage = WorldSection | 'travel'
export const world = {
  cabin: [38, .1, -12] as [number, number, number],
  skills: [64, .1, -28] as [number, number, number],
  projects: [90, 0, -44] as [number, number, number],
  journey: [122, 0, -62] as [number, number, number],
  contact: [184, 2, -104] as [number, number, number],
  contactTablet: { position: [198, 15, -77], target: [177, 4, -104] } as const,
  terminal: [154, 2, -84] as [number, number, number],
  terminalTablet: { position: [167, 14, -59], target: [147, 4, -84] } as const,
  journeyTablet: { position: [135, 15, -27], target: [115.5, 3.5, -63] } as const,
  cameras: {
    desktop: { contact: [195, 12, -82], contactTarget: [178, 4, -104], contactControls: [[174, 13, -69], [187, 13, -77]], contactTargetControls: [[171, 4, -94], [181, 4, -103]], terminal: [165, 12, -62], terminalTarget: [148, 4, -84], terminalControls: [[139, 14, -43], [157, 13, -54]], terminalTargetControls: [[141, 5, -75], [151, 4, -82]], journey: [132, 13, -35], journeyTarget: [117, 3.5, -63], journeyControls: [[107, 13, -20], [128, 15, -24]], journeyTargetControls: [[111, 2, -49], [122, 3, -60]], projects: [97, 12, -16], projectsTarget: [85.5, 2.7, -43], projectsControls: [[75, 10, -9], [89, 13, -10]], projectsTargetControls: [[77, 3, -34], [88, 3, -43]], skills: [70, 8, -7], skillsTarget: [60, 3.2, -28], skillsControls: [[49, 9, 5], [60, 9, 0]], skillsTargetControls: [[57, 2.8, -20], [66, 3.4, -27]], wide: [10, 9, 30], home: [8, 6.7, 24], homeTarget: [0, 1.6, 0], about: [46, 7.5, 5], aboutTarget: [32.5, 2.1, -12], controls: [[14, 10, 18], [34, 10, 14]], targetControls: [[28, 2, -7], [40, 2, -11]] },
    mobile: { contact: [190, 12, -79], contactTarget: [184, 3, -104], contactControls: [[174, 13, -69], [187, 13, -77]], contactTargetControls: [[171, 4, -94], [181, 4, -103]], terminal: [160, 12, -59], terminalTarget: [154, 3, -84], terminalControls: [[139, 14, -43], [157, 13, -54]], terminalTargetControls: [[141, 5, -75], [151, 4, -82]], journey: [130, 14, -31], journeyTarget: [122, 3.5, -63], journeyControls: [[107, 13, -20], [128, 15, -24]], journeyTargetControls: [[111, 2, -49], [122, 3, -60]], projects: [95, 12, -13], projectsTarget: [90, 2.3, -43], projectsControls: [[75, 10, -9], [89, 13, -10]], projectsTargetControls: [[77, 3, -34], [88, 3, -43]], skills: [68, 8, -7], skillsTarget: [64, 3.5, -28], skillsControls: [[49, 9, 5], [60, 9, 0]], skillsTargetControls: [[57, 2.8, -20], [66, 3.4, -27]], wide: [9, 9, 29], home: [8, 7, 25], homeTarget: [5.6, 1.8, 2.2], about: [46, 7.5, 5], aboutTarget: [38, 2, -12], controls: [[16, 10, 19], [34, 10, 15]], targetControls: [[28, 2, -7], [40, 2, -11]] },
  },
} as const

