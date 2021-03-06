
import ScenesReducer from '../ScenesReducer';

/**
 * Simulate scenes transtion with changes of navigation states.
 */
function testTransition(states) {
  const routes = states.map(keys => ({
    index: 0,
    routes: keys.map(key => ({ key })),
  }));

  let scenes = [];
  let prevState = null;
  routes.forEach((nextState) => {
    scenes = ScenesReducer(scenes, nextState, prevState);
    prevState = nextState;
  });

  return scenes;
}

describe('ScenesReducer', () => {
  it('gets initial scenes', () => {
    const scenes = testTransition([
      ['1', '2'],
    ]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_1',
        route: {
          key: '1',
        },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        key: 'scene_2',
        route: {
          key: '2',
        },
      },
    ]);
  });

  it('pushes new scenes', () => {
    // Transition from ['1', '2'] to ['1', '2', '3'].
    const scenes = testTransition([
      ['1', '2'],
      ['1', '2', '3'],
    ]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_1',
        route: {
          key: '1',
        },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        key: 'scene_2',
        route: {
          key: '2',
        },
      },
      {
        index: 2,
        isActive: false,
        isStale: false,
        key: 'scene_3',
        route: {
          key: '3',
        },
      },
    ]);
  });

  it('gets active scene when index changes', () => {
    const state1 = {
      index: 0,
      routes: [{ key: '1' }, { key: '2' }],
    };

    const state2 = {
      index: 1,
      routes: [{ key: '1' }, { key: '2' }],
    };

    const scenes1 = ScenesReducer([], state1, null);
    const scenes2 = ScenesReducer(scenes1, state2, state1);
    const route = scenes2.find(scene => scene.isActive).route;
    expect(route).toEqual({ key: '2' });
  });

  it('gets same scenes', () => {
    const state1 = {
      index: 0,
      routes: [{ key: '1' }, { key: '2' }],
    };

    const state2 = {
      index: 0,
      routes: [{ key: '1' }, { key: '2' }],
    };

    const scenes1 = ScenesReducer([], state1, null);
    const scenes2 = ScenesReducer(scenes1, state2, state1);
    expect(scenes1).toBe(scenes2);
  });

  it('gets different scenes when keys are different', () => {
    const state1 = {
      index: 0,
      routes: [{ key: '1' }, { key: '2' }],
    };

    const state2 = {
      index: 0,
      routes: [{ key: '2' }, { key: '1' }],
    };

    const scenes1 = ScenesReducer([], state1, null);
    const scenes2 = ScenesReducer(scenes1, state2, state1);
    expect(scenes1).not.toBe(scenes2);
  });

  it('gets different scenes when routes are different', () => {
    const state1 = {
      index: 0,
      routes: [{ key: '1', x: 1 }, { key: '2', x: 2 }],
    };

    const state2 = {
      index: 0,
      routes: [{ key: '1', x: 3 }, { key: '2', x: 4 }],
    };

    const scenes1 = ScenesReducer([], state1, null);
    const scenes2 = ScenesReducer(scenes1, state2, state1);
    expect(scenes1).not.toBe(scenes2);
  });


  it('gets different scenes when state index changes', () => {
    const state1 = {
      index: 0,
      routes: [{ key: '1', x: 1 }, { key: '2', x: 2 }],
    };

    const state2 = {
      index: 1,
      routes: [{ key: '1', x: 1 }, { key: '2', x: 2 }],
    };

    const scenes1 = ScenesReducer([], state1, null);
    const scenes2 = ScenesReducer(scenes1, state2, state1);
    expect(scenes1).not.toBe(scenes2);
  });

  it('pops scenes', () => {
    // Transition from ['1', '2', '3'] to ['1', '2'].
    const scenes = testTransition([
      ['1', '2', '3'],
      ['1', '2'],
    ]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_1',
        route: {
          key: '1',
        },
      },
      {
        index: 1,
        isActive: false,
        isStale: false,
        key: 'scene_2',
        route: {
          key: '2',
        },
      },
      {
        index: 2,
        isActive: false,
        isStale: true,
        key: 'scene_3',
        route: {
          key: '3',
        },
      },
    ]);
  });

  it('replaces scenes', () => {
    const scenes = testTransition([
      ['1', '2'],
      ['3'],
    ]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: true,
        key: 'scene_1',
        route: {
          key: '1',
        },
      },
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_3',
        route: {
          key: '3',
        },
      },
      {
        index: 1,
        isActive: false,
        isStale: true,
        key: 'scene_2',
        route: {
          key: '2',
        },
      },
    ]);
  });

  it('revives scenes', () => {
    const scenes = testTransition([
      ['1', '2'],
      ['3'],
      ['2'],
    ]);

    expect(scenes).toEqual([
      {
        index: 0,
        isActive: false,
        isStale: true,
        key: 'scene_1',
        route: {
          key: '1',
        },
      },
      {
        index: 0,
        isActive: true,
        isStale: false,
        key: 'scene_2',
        route: {
          key: '2',
        },
      },
      {
        index: 0,
        isActive: false,
        isStale: true,
        key: 'scene_3',
        route: {
          key: '3',
        },
      },
    ]);
  });
});
