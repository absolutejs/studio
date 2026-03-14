// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= new Set()).add(PUBLIC_VERSION);
}

// node_modules/svelte/src/constants.js
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol();
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";

// node_modules/esm-env/true.js
var true_default = true;
// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
var noop = () => {};
function run_all(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var STALE_REACTION = new (class StaleReactionError extends Error {
  name = "StaleReactionError";
  message =
    "The reaction that called `getAbortSignal()` was re-run or destroyed";
})();
var IS_XHTML =
  !!globalThis.document?.contentType &&
  /* @__PURE__ */ globalThis.document.contentType.includes("xml");
var ELEMENT_NODE = 1;
var COMMENT_NODE = 8;
var DOCUMENT_FRAGMENT_NODE = 11;
// node_modules/svelte/src/internal/client/errors.js
function component_api_changed(method, component) {
  if (true_default) {
    const error = new Error(`component_api_changed
Calling \`${method}\` on a component instance (of ${component}) is no longer valid in Svelte 5
https://svelte.dev/e/component_api_changed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/component_api_changed`);
  }
}
function component_api_invalid_new(component, name) {
  if (true_default) {
    const error = new Error(`component_api_invalid_new
Attempted to instantiate ${component} with \`new ${name}\`, which is no longer valid in Svelte 5. If this component is not under your control, set the \`compatibility.componentApi\` compiler option to \`4\` to keep it working.
https://svelte.dev/e/component_api_invalid_new`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/component_api_invalid_new`);
  }
}
function derived_references_self() {
  if (true_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function effect_update_depth_exceeded() {
  if (true_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (true_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function props_invalid_value(key) {
  if (true_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key}={undefined}\` when \`${key}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function rune_outside_svelte(rune) {
  if (true_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function state_descriptors_fixed() {
  if (true_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (true_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (true_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (true_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function hydration_mismatch(location2) {
  if (true_default) {
    console.warn(
      `%c[svelte] hydration_mismatch
%c${location2 ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location2}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (true_default) {
    console.warn(
      `%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (true_default) {
    console.warn(
      `%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (true_default) {
    console.warn(
      `%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (true_default) {
    console.warn(
      `%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return (hydrate_node = node);
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = node.data;
      if (data === HYDRATION_END) {
        if (depth === 0) return node;
        depth -= 1;
      } else if (
        data === HYDRATION_START ||
        data === HYDRATION_START_ELSE ||
        (data[0] === "[" && !isNaN(Number(data.slice(1))))
      ) {
        depth += 1;
      }
    }
    var next2 = get_next_sibling(node);
    if (remove) node.remove();
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b ||
        (a !== null && typeof a === "object") ||
        typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source, label) {
  source.label = label;
  tag_proxy(source.v, label);
  return source;
}
function tag_proxy(value, label) {
  value?.[PROXY_PATH_SYMBOL]?.(label);
  return value;
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label) {
  const error = new Error();
  const stack = get_stack();
  if (stack.length === 0) {
    return null;
  }
  stack.unshift(`
`);
  define_property(error, "stack", {
    value: stack.join(`
`),
  });
  define_property(error, "name", {
    value: label,
  });
  return error;
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack) return [];
  const lines = stack.split(`
`);
  const new_lines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (
      posixified.includes("svelte/src/internal") ||
      posixified.includes("node_modules/.vite")
    ) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack) {
  dev_stack = stack;
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null,
  };
  if (true_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component) {
  var context = component_context;
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component !== undefined) {
    context.x = component;
  }
  context.i = true;
  component_context = context.p;
  if (true_default) {
    dev_current_component_function = component_context?.function ?? null;
  }
  return component ?? {};
}
function is_runes() {
  return (
    !legacy_mode_flag ||
    (component_context !== null && component_context.l === null)
  );
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks) run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = new WeakMap();
function handle_error(error) {
  var effect = active_effect;
  if (effect === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (true_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect));
  }
  if ((effect.f & REACTION_RAN) === 0 && (effect.f & EFFECT) === 0) {
    if (true_default && !effect.parent && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  invoke_error_boundary(error, effect);
}
function invoke_error_boundary(error, effect) {
  while (effect !== null) {
    if ((effect.f & BOUNDARY_EFFECT) !== 0) {
      if ((effect.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect = effect.parent;
  }
  if (true_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect) {
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable) return;
  var indent = is_firefox ? "  " : "\t";
  var component_stack = `
${indent}in ${effect.fn?.name || "<unknown>"}`;
  var context = effect.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message:
      error.message +
      `
${component_stack}
`,
    stack: error.stack
      ?.split(
        `
`,
      )
      .filter((line) => !line.includes("svelte/src/internal")).join(`
`),
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message,
    });
    define_property(error, "stack", {
      value: adjusted.stack,
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = (signal.f & STATUS_MASK) | status;
}
function update_derived_status(derived) {
  if ((derived.f & CONNECTED) !== 0 || derived.deps === null) {
    set_signal_status(derived, CLEAN);
  } else {
    set_signal_status(derived, MAYBE_DIRTY);
  }
}

// node_modules/svelte/src/internal/client/reactivity/utils.js
function clear_marked(deps) {
  if (deps === null) return;
  for (const dep of deps) {
    if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
      continue;
    }
    dep.f ^= WAS_MARKED;
    clear_marked(dep.deps);
  }
}
function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
  if ((effect.f & DIRTY) !== 0) {
    dirty_effects.add(effect);
  } else if ((effect.f & MAYBE_DIRTY) !== 0) {
    maybe_dirty_effects.add(effect);
  }
  clear_marked(effect.deps);
  set_signal_status(effect, CLEAN);
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var batches = new Set();
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var queued_root_effects = [];
var last_scheduled_effect = null;
var is_flushing = false;
var is_flushing_sync = false;

class Batch {
  current = new Map();
  previous = new Map();
  #commit_callbacks = new Set();
  #discard_callbacks = new Set();
  #pending = 0;
  #blocking_pending = 0;
  #deferred = null;
  #dirty_effects = new Set();
  #maybe_dirty_effects = new Set();
  #skipped_branches = new Map();
  is_fork = false;
  #decrement_queued = false;
  #is_deferred() {
    return this.is_fork || this.#blocking_pending > 0;
  }
  skip_effect(effect) {
    if (!this.#skipped_branches.has(effect)) {
      this.#skipped_branches.set(effect, { d: [], m: [] });
    }
  }
  unskip_effect(effect) {
    var tracked = this.#skipped_branches.get(effect);
    if (tracked) {
      this.#skipped_branches.delete(effect);
      for (var e of tracked.d) {
        set_signal_status(e, DIRTY);
        schedule_effect(e);
      }
      for (e of tracked.m) {
        set_signal_status(e, MAYBE_DIRTY);
        schedule_effect(e);
      }
    }
  }
  process(root_effects) {
    queued_root_effects = [];
    this.apply();
    var effects = [];
    var render_effects = [];
    for (const root of root_effects) {
      this.#traverse_effect_tree(root, effects, render_effects);
    }
    if (this.#is_deferred()) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      for (const [e, t] of this.#skipped_branches) {
        reset_branch(e, t);
      }
    } else {
      for (const fn of this.#commit_callbacks) fn();
      this.#commit_callbacks.clear();
      if (this.#pending === 0) {
        this.#commit();
      }
      previous_batch = this;
      current_batch = null;
      flush_queued_effects(render_effects);
      flush_queued_effects(effects);
      previous_batch = null;
      this.#deferred?.resolve();
    }
    batch_values = null;
  }
  #traverse_effect_tree(root, effects, render_effects) {
    root.f ^= CLEAN;
    var effect = root.first;
    while (effect !== null) {
      var flags = effect.f;
      var is_branch = (flags & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags & CLEAN) !== 0;
      var skip =
        is_skippable_branch ||
        (flags & INERT) !== 0 ||
        this.#skipped_branches.has(effect);
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if ((flags & EFFECT) !== 0) {
          effects.push(effect);
        } else if (
          async_mode_flag &&
          (flags & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0
        ) {
          render_effects.push(effect);
        } else if (is_dirty(effect)) {
          if ((flags & BLOCK_EFFECT) !== 0)
            this.#maybe_dirty_effects.add(effect);
          update_effect(effect);
        }
        var child = effect.first;
        if (child !== null) {
          effect = child;
          continue;
        }
      }
      while (effect !== null) {
        var next2 = effect.next;
        if (next2 !== null) {
          effect = next2;
          break;
        }
        effect = effect.parent;
      }
    }
  }
  #defer_effects(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
    }
  }
  capture(source2, value) {
    if (value !== UNINITIALIZED && !this.previous.has(source2)) {
      this.previous.set(source2, value);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, source2.v);
      batch_values?.set(source2, source2.v);
    }
  }
  activate() {
    current_batch = this;
    this.apply();
  }
  deactivate() {
    if (current_batch !== this) return;
    current_batch = null;
    batch_values = null;
  }
  flush() {
    this.activate();
    if (queued_root_effects.length > 0) {
      flush_effects();
      if (current_batch !== null && current_batch !== this) {
        return;
      }
    } else if (this.#pending === 0) {
      this.process([]);
    }
    this.deactivate();
  }
  discard() {
    for (const fn of this.#discard_callbacks) fn(this);
    this.#discard_callbacks.clear();
  }
  #commit() {
    if (batches.size > 1) {
      this.previous.clear();
      var previous_batch_values = batch_values;
      var is_earlier = true;
      for (const batch of batches) {
        if (batch === this) {
          is_earlier = false;
          continue;
        }
        const sources = [];
        for (const [source2, value] of this.current) {
          if (batch.current.has(source2)) {
            if (is_earlier && value !== batch.current.get(source2)) {
              batch.current.set(source2, value);
            } else {
              continue;
            }
          }
          sources.push(source2);
        }
        if (sources.length === 0) {
          continue;
        }
        const others = [...batch.current.keys()].filter(
          (s) => !this.current.has(s),
        );
        if (others.length > 0) {
          var prev_queued_root_effects = queued_root_effects;
          queued_root_effects = [];
          const marked = new Set();
          const checked = new Map();
          for (const source2 of sources) {
            mark_effects(source2, others, marked, checked);
          }
          if (queued_root_effects.length > 0) {
            current_batch = batch;
            batch.apply();
            for (const root of queued_root_effects) {
              batch.#traverse_effect_tree(root, [], []);
            }
            batch.deactivate();
          }
          queued_root_effects = prev_queued_root_effects;
        }
      }
      current_batch = null;
      batch_values = previous_batch_values;
    }
    batches.delete(this);
  }
  increment(blocking) {
    this.#pending += 1;
    if (blocking) this.#blocking_pending += 1;
  }
  decrement(blocking) {
    this.#pending -= 1;
    if (blocking) this.#blocking_pending -= 1;
    if (this.#decrement_queued) return;
    this.#decrement_queued = true;
    queue_micro_task(() => {
      this.#decrement_queued = false;
      if (!this.#is_deferred()) {
        this.revive();
      } else if (queued_root_effects.length > 0) {
        this.flush();
      }
    });
  }
  revive() {
    for (const e of this.#dirty_effects) {
      this.#maybe_dirty_effects.delete(e);
      set_signal_status(e, DIRTY);
      schedule_effect(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      schedule_effect(e);
    }
    this.flush();
  }
  oncommit(fn) {
    this.#commit_callbacks.add(fn);
  }
  ondiscard(fn) {
    this.#discard_callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = (current_batch = new Batch());
      batches.add(current_batch);
      if (!is_flushing_sync) {
        queue_micro_task(() => {
          if (current_batch !== batch) {
            return;
          }
          batch.flush();
        });
      }
    }
    return current_batch;
  }
  apply() {
    if (!async_mode_flag || (!this.is_fork && batches.size === 1)) return;
    batch_values = new Map(this.current);
    for (const batch of batches) {
      if (batch === this) continue;
      for (const [source2, previous] of batch.previous) {
        if (!batch_values.has(source2)) {
          batch_values.set(source2, previous);
        }
      }
    }
  }
}
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null) {
        flush_effects();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (queued_root_effects.length === 0) {
        current_batch?.flush();
        if (queued_root_effects.length === 0) {
          last_scheduled_effect = null;
          return result;
        }
      }
      flush_effects();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function flush_effects() {
  is_flushing = true;
  var source_stacks = true_default ? new Set() : null;
  try {
    var flush_count = 0;
    while (queued_root_effects.length > 0) {
      var batch = Batch.ensure();
      if (flush_count++ > 1000) {
        if (true_default) {
          var updates = new Map();
          for (const source2 of batch.current.keys()) {
            for (const [stack, update2] of source2.updated ?? []) {
              var entry = updates.get(stack);
              if (!entry) {
                entry = { error: update2.error, count: 0 };
                updates.set(stack, entry);
              }
              entry.count += update2.count;
            }
          }
          for (const update2 of updates.values()) {
            if (update2.error) {
              console.error(update2.error);
            }
          }
        }
        infinite_loop_guard();
      }
      batch.process(queued_root_effects);
      old_values.clear();
      if (true_default) {
        for (const source2 of batch.current.keys()) {
          source_stacks.add(source2);
        }
      }
    }
  } finally {
    queued_root_effects = [];
    is_flushing = false;
    last_scheduled_effect = null;
    if (true_default) {
      for (const source2 of source_stacks) {
        source2.updated = null;
      }
    }
  }
}
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (true_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0) return;
  var i = 0;
  while (i < length) {
    var effect = effects[i++];
    if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
      eager_block_effects = new Set();
      update_effect(effect);
      if (
        effect.deps === null &&
        effect.first === null &&
        effect.nodes === null &&
        effect.teardown === null &&
        effect.ac === null
      ) {
        unlink_effect(effect);
      }
      if (eager_block_effects?.size > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0) continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j = ordered_effects.length - 1; j >= 0; j--) {
            const e2 = ordered_effects[j];
            if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value)) return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags = reaction.f;
      if ((flags & DERIVED) !== 0) {
        mark_effects(reaction, sources, marked, checked);
      } else if (
        (flags & (ASYNC | BLOCK_EFFECT)) !== 0 &&
        (flags & DIRTY) === 0 &&
        depends_on(reaction, sources, checked)
      ) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(reaction);
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== undefined) return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (includes.call(sources, dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(dep, sources, checked)) {
        checked.set(dep, true);
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(signal) {
  var effect = (last_scheduled_effect = signal);
  var boundary = effect.b;
  if (
    boundary?.is_pending &&
    (signal.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 &&
    (signal.f & REACTION_RAN) === 0
  ) {
    boundary.defer_effect(signal);
    return;
  }
  while (effect.parent !== null) {
    effect = effect.parent;
    var flags = effect.f;
    if (
      is_flushing &&
      effect === active_effect &&
      (flags & BLOCK_EFFECT) !== 0 &&
      (flags & HEAD_EFFECT) === 0 &&
      (flags & REACTION_RAN) !== 0
    ) {
      return;
    }
    if ((flags & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
      if ((flags & CLEAN) === 0) {
        return;
      }
      effect.f ^= CLEAN;
    }
  }
  queued_root_effects.push(effect);
}
function reset_branch(effect, tracked) {
  if ((effect.f & BRANCH_EFFECT) !== 0 && (effect.f & CLEAN) !== 0) {
    return;
  }
  if ((effect.f & DIRTY) !== 0) {
    tracked.d.push(effect);
  } else if ((effect.f & MAYBE_DIRTY) !== 0) {
    tracked.m.push(effect);
  }
  set_signal_status(effect, CLEAN);
  var e = effect.first;
  while (e !== null) {
    reset_branch(e, tracked);
    e = e.next;
  }
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (true_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = undefined;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children, transform_error) {
  new Boundary(node, props, children, transform_error);
}

class Boundary {
  parent;
  is_pending = false;
  transform_error;
  #anchor;
  #hydrate_open = hydrating ? hydrate_node : null;
  #props;
  #children;
  #effect;
  #main_effect = null;
  #pending_effect = null;
  #failed_effect = null;
  #offscreen_fragment = null;
  #local_pending_count = 0;
  #pending_count = 0;
  #pending_count_update_queued = false;
  #dirty_effects = new Set();
  #maybe_dirty_effects = new Set();
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    if (true_default) {
      tag(this.#effect_pending, "$effect.pending()");
    }
    return () => {
      this.#effect_pending = null;
    };
  });
  constructor(node, props, children, transform_error) {
    this.#anchor = node;
    this.#props = props;
    this.#children = (anchor) => {
      var effect = active_effect;
      effect.b = this;
      effect.f |= BOUNDARY_EFFECT;
      children(anchor);
    };
    this.parent = active_effect.b;
    this.transform_error =
      transform_error ?? this.parent?.transform_error ?? ((e) => e);
    this.#effect = block(() => {
      if (hydrating) {
        const comment = this.#hydrate_open;
        hydrate_next();
        const server_rendered_pending = comment.data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment.data.startsWith(
          HYDRATION_START_FAILED,
        );
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(
            comment.data.slice(HYDRATION_START_FAILED.length),
          );
          this.#hydrate_failed_content(serialized_error);
        } else if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        this.#render();
      }
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
  }
  #hydrate_failed_content(error) {
    const failed = this.#props.failed;
    if (!failed) return;
    this.#failed_effect = branch(() => {
      failed(
        this.#anchor,
        () => error,
        () => () => {},
      );
    });
  }
  #hydrate_pending_content() {
    const pending = this.#props.pending;
    if (!pending) return;
    this.is_pending = true;
    this.#pending_effect = branch(() => pending(this.#anchor));
    queue_micro_task(() => {
      var fragment = (this.#offscreen_fragment =
        document.createDocumentFragment());
      var anchor = create_text();
      fragment.append(anchor);
      this.#main_effect = this.#run(() => {
        Batch.ensure();
        return branch(() => this.#children(anchor));
      });
      if (this.#pending_count === 0) {
        this.#anchor.before(fragment);
        this.#offscreen_fragment = null;
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
        this.#resolve();
      }
    });
  }
  #render() {
    try {
      this.is_pending = this.has_pending_snippet();
      this.#pending_count = 0;
      this.#local_pending_count = 0;
      this.#main_effect = branch(() => {
        this.#children(this.#anchor);
      });
      if (this.#pending_count > 0) {
        var fragment = (this.#offscreen_fragment =
          document.createDocumentFragment());
        move_effect(this.#main_effect, fragment);
        const pending = this.#props.pending;
        this.#pending_effect = branch(() => pending(this.#anchor));
      } else {
        this.#resolve();
      }
    } catch (error) {
      this.error(error);
    }
  }
  #resolve() {
    this.is_pending = false;
    for (const e of this.#dirty_effects) {
      set_signal_status(e, DIRTY);
      schedule_effect(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      schedule_effect(e);
    }
    this.#dirty_effects.clear();
    this.#maybe_dirty_effects.clear();
  }
  defer_effect(effect) {
    defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  #update_pending_count(d) {
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        this.parent.#update_pending_count(d);
      }
      return;
    }
    this.#pending_count += d;
    if (this.#pending_count === 0) {
      this.#resolve();
      if (this.#pending_effect) {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
      }
      if (this.#offscreen_fragment) {
        this.#anchor.before(this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      }
    }
  }
  update_pending_count(d) {
    this.#update_pending_count(d);
    this.#local_pending_count += d;
    if (!this.#effect_pending || this.#pending_count_update_queued) return;
    this.#pending_count_update_queued = true;
    queue_micro_task(() => {
      this.#pending_count_update_queued = false;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    });
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get(this.#effect_pending);
  }
  error(error) {
    var onerror = this.#props.onerror;
    let failed = this.#props.failed;
    if (!onerror && !failed) {
      throw error;
    }
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(this.#hydrate_open);
      next();
      set_hydrate_node(skip_nodes());
    }
    var did_reset = false;
    var calling_on_error = false;
    const reset = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#run(() => {
        Batch.ensure();
        this.#render();
      });
    };
    const handle_error_result = (transformed_error) => {
      try {
        calling_on_error = true;
        onerror?.(transformed_error, reset);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, this.#effect && this.#effect.parent);
      }
      if (failed) {
        this.#failed_effect = this.#run(() => {
          Batch.ensure();
          try {
            return branch(() => {
              var effect = active_effect;
              effect.b = this;
              effect.f |= BOUNDARY_EFFECT;
              failed(
                this.#anchor,
                () => transformed_error,
                () => reset,
              );
            });
          } catch (error2) {
            invoke_error_boundary(error2, this.#effect.parent);
            return null;
          }
        });
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, this.#effect && this.#effect.parent);
        return;
      }
      if (
        result !== null &&
        typeof result === "object" &&
        typeof result.then === "function"
      ) {
        result.then(handle_error_result, (e) =>
          invoke_error_boundary(e, this.#effect && this.#effect.parent),
        );
      } else {
        handle_error_result(result);
      }
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var recent_async_deriveds = new Set();
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  var parent_derived =
    active_reaction !== null && (active_reaction.f & DERIVED) !== 0
      ? active_reaction
      : null;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: UNINITIALIZED,
    wv: 0,
    parent: parent_derived ?? active_effect,
    ac: null,
  };
  if (true_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
function derived_safe_equal(fn) {
  const signal = derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(effects[i]);
    }
  }
}
var stack = [];
function get_derived_parent_effect(derived2) {
  var parent = derived2.parent;
  while (parent !== null) {
    if ((parent.f & DERIVED) === 0) {
      return (parent.f & DESTROYED) === 0 ? parent : null;
    }
    parent = parent.parent;
  }
  return null;
}
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  set_active_effect(get_derived_parent_effect(derived2));
  if (true_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(new Set());
    try {
      if (includes.call(stack, derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.wv = increment_write_version();
    if (!current_batch?.is_fork || derived2.deps === null) {
      derived2.v = value;
      if (derived2.deps === null) {
        set_signal_status(derived2, CLEAN);
        return;
      }
    }
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || current_batch?.is_fork) {
      batch_values.set(derived2, value);
    }
  } else {
    update_derived_status(derived2);
  }
}
function freeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown || e.ac) {
      e.teardown?.();
      e.ac?.abort(STALE_REACTION);
      e.teardown = noop;
      e.ac = null;
      remove_reactions(e, 0);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown) {
      update_effect(e);
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = new Set();
var old_values = new Map();
function set_eager_effects(v) {
  eager_effects = v;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v, stack2) {
  var signal = {
    f: 0,
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0,
  };
  if (true_default && tracing_mode_flag) {
    signal.created = stack2 ?? get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
function state(v, stack2) {
  const s = source(v, stack2);
  push_reaction_value(s);
  return s;
}
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (
    legacy_mode_flag &&
    trackable &&
    component_context !== null &&
    component_context.l !== null
  ) {
    (component_context.l.s ??= []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (
    active_reaction !== null &&
    (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) &&
    is_runes() &&
    (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !==
      0 &&
    (current_sources === null || !includes.call(current_sources, source2))
  ) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (true_default) {
    tag_proxy(new_value, source2.label);
  }
  return internal_set(source2, new_value);
}
function internal_set(source2, value) {
  if (!source2.equals(value)) {
    var old_value = source2.v;
    if (is_destroying_effect) {
      old_values.set(source2, value);
    } else {
      old_values.set(source2, old_value);
    }
    source2.v = value;
    var batch = Batch.ensure();
    batch.capture(source2, old_value);
    if (true_default) {
      if (tracing_mode_flag || active_effect !== null) {
        source2.updated ??= new Map();
        const count = (source2.updated.get("")?.count ?? 0) + 1;
        source2.updated.set("", { error: null, count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      const derived2 = source2;
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(derived2);
      }
      update_derived_status(derived2);
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY);
    if (
      is_runes() &&
      active_effect !== null &&
      (active_effect.f & CLEAN) !== 0 &&
      (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0
    ) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  for (const effect of eager_effects) {
    if ((effect.f & CLEAN) !== 0) {
      set_signal_status(effect, MAYBE_DIRTY);
    }
    if (is_dirty(effect)) {
      update_effect(effect);
    }
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0; i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect) continue;
    if (true_default && (flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(reaction);
      continue;
    }
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & DERIVED) !== 0) {
      var derived2 = reaction;
      batch_values?.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY);
      }
    } else if (not_dirty) {
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(reaction);
      }
      schedule_effect(reaction);
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = new Map();
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 =
    true_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(value.length, stack2));
    if (true_default) {
      value = inspectable_array(value);
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating) return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop, source2] of sources) {
      tag(source2, get_label(path, prop));
    }
    updating = false;
  }
  return new Proxy(value, {
    defineProperty(_, prop, descriptor) {
      if (
        !("value" in descriptor) ||
        descriptor.configurable === false ||
        descriptor.enumerable === false ||
        descriptor.writable === false
      ) {
        state_descriptors_fixed();
      }
      var s = sources.get(prop);
      if (s === undefined) {
        with_parent(() => {
          var s2 = state(descriptor.value, stack2);
          sources.set(prop, s2);
          if (true_default && typeof prop === "string") {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
      } else {
        set(s, descriptor.value, true);
      }
      return true;
    },
    deleteProperty(target, prop) {
      var s = sources.get(prop);
      if (s === undefined) {
        if (prop in target) {
          const s2 = with_parent(() => state(UNINITIALIZED, stack2));
          sources.set(prop, s2);
          increment(version);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
        }
      } else {
        set(s, UNINITIALIZED);
        increment(version);
      }
      return true;
    },
    get(target, prop, receiver) {
      if (prop === STATE_SYMBOL) {
        return value;
      }
      if (true_default && prop === PROXY_PATH_SYMBOL) {
        return update_path;
      }
      var s = sources.get(prop);
      var exists = prop in target;
      if (
        s === undefined &&
        (!exists || get_descriptor(target, prop)?.writable)
      ) {
        s = with_parent(() => {
          var p = proxy(exists ? target[prop] : UNINITIALIZED);
          var s2 = state(p, stack2);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
        sources.set(prop, s);
      }
      if (s !== undefined) {
        var v = get(s);
        return v === UNINITIALIZED ? undefined : v;
      }
      return Reflect.get(target, prop, receiver);
    },
    getOwnPropertyDescriptor(target, prop) {
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor && "value" in descriptor) {
        var s = sources.get(prop);
        if (s) descriptor.value = get(s);
      } else if (descriptor === undefined) {
        var source2 = sources.get(prop);
        var value2 = source2?.v;
        if (source2 !== undefined && value2 !== UNINITIALIZED) {
          return {
            enumerable: true,
            configurable: true,
            value: value2,
            writable: true,
          };
        }
      }
      return descriptor;
    },
    has(target, prop) {
      if (prop === STATE_SYMBOL) {
        return true;
      }
      var s = sources.get(prop);
      var has =
        (s !== undefined && s.v !== UNINITIALIZED) || Reflect.has(target, prop);
      if (
        s !== undefined ||
        (active_effect !== null &&
          (!has || get_descriptor(target, prop)?.writable))
      ) {
        if (s === undefined) {
          s = with_parent(() => {
            var p = has ? proxy(target[prop]) : UNINITIALIZED;
            var s2 = state(p, stack2);
            if (true_default) {
              tag(s2, get_label(path, prop));
            }
            return s2;
          });
          sources.set(prop, s);
        }
        var value2 = get(s);
        if (value2 === UNINITIALIZED) {
          return false;
        }
      }
      return has;
    },
    set(target, prop, value2, receiver) {
      var s = sources.get(prop);
      var has = prop in target;
      if (is_proxied_array && prop === "length") {
        for (var i = value2; i < s.v; i += 1) {
          var other_s = sources.get(i + "");
          if (other_s !== undefined) {
            set(other_s, UNINITIALIZED);
          } else if (i in target) {
            other_s = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(i + "", other_s);
            if (true_default) {
              tag(other_s, get_label(path, i));
            }
          }
        }
      }
      if (s === undefined) {
        if (!has || get_descriptor(target, prop)?.writable) {
          s = with_parent(() => state(undefined, stack2));
          if (true_default) {
            tag(s, get_label(path, prop));
          }
          set(s, proxy(value2));
          sources.set(prop, s);
        }
      } else {
        has = s.v !== UNINITIALIZED;
        var p = with_parent(() => proxy(value2));
        set(s, p);
      }
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor?.set) {
        descriptor.set.call(receiver, value2);
      }
      if (!has) {
        if (is_proxied_array && typeof prop === "string") {
          var ls = sources.get("length");
          var n = Number(prop);
          if (Number.isInteger(n) && n >= ls.v) {
            set(ls, n + 1);
          }
        }
        increment(version);
      }
      return true;
    },
    ownKeys(target) {
      get(version);
      var own_keys = Reflect.ownKeys(target).filter((key2) => {
        var source3 = sources.get(key2);
        return source3 === undefined || source3.v !== UNINITIALIZED;
      });
      for (var [key, source2] of sources) {
        if (source2.v !== UNINITIALIZED && !(key in target)) {
          own_keys.push(key);
        }
      }
      return own_keys;
    },
    setPrototypeOf() {
      state_prototype_fixed();
    },
  });
}
function get_label(path, prop) {
  if (typeof prop === "symbol")
    return `${path}[Symbol(${prop.description ?? ""})]`;
  if (regex_is_valid_identifier.test(prop)) return `${path}.${prop}`;
  return /^\d+$/.test(prop) ? `${path}[${prop}]` : `${path}['${prop}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {}
  return value;
}
var ARRAY_MUTATING_METHODS = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift",
]);
function inspectable_array(array) {
  return new Proxy(array, {
    get(target, prop, receiver) {
      var value = Reflect.get(target, prop, receiver);
      if (!ARRAY_MUTATING_METHODS.has(prop)) {
        return value;
      }
      return function (...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    },
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
  array_prototype2.indexOf = function (item, from_index) {
    const index = indexOf.call(this, item, from_index);
    if (index === -1) {
      for (let i = from_index ?? 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.lastIndexOf = function (item, from_index) {
    const index = lastIndexOf.call(this, item, from_index ?? this.length - 1);
    if (index === -1) {
      for (let i = 0; i <= (from_index ?? this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.includes = function (item, from_index) {
    const has = includes2.call(this, item, from_index);
    if (!has) {
      for (let i = 0; i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes2;
  };
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== undefined) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype.__click = undefined;
    element_prototype.__className = undefined;
    element_prototype.__attributes = null;
    element_prototype.__style = undefined;
    element_prototype.__e = undefined;
  }
  if (is_extensible(text_prototype)) {
    text_prototype.__t = undefined;
  }
  if (true_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
function get_first_child(node) {
  return first_child_getter.call(node);
}
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag) return false;
  if (eager_block_effects !== null) return false;
  var flags2 = active_effect.f;
  return (flags2 & REACTION_RAN) !== 0;
}
function create_element(tag2, namespace, is) {
  let options = is ? { is } : undefined;
  return document.createElementNS(namespace ?? NAMESPACE_HTML, tag2, options);
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function push_effect(effect, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect;
  } else {
    parent_last.next = effect;
    effect.prev = parent_last;
    parent_effect.last = effect;
  }
}
function create_effect(type, fn, sync) {
  var parent = active_effect;
  if (true_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
  };
  if (true_default) {
    effect.component_function = dev_current_component_function;
  }
  if (sync) {
    try {
      update_effect(effect);
    } catch (e2) {
      destroy_effect(effect);
      throw e2;
    }
  } else if (fn !== null) {
    schedule_effect(effect);
  }
  var e = effect;
  if (
    sync &&
    e.deps === null &&
    e.teardown === null &&
    e.nodes === null &&
    e.first === e.last &&
    (e.f & EFFECT_PRESERVED) === 0
  ) {
    e = e.first;
    if (
      (type & BLOCK_EFFECT) !== 0 &&
      (type & EFFECT_TRANSPARENT) !== 0 &&
      e !== null
    ) {
      e.f |= EFFECT_TRANSPARENT;
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (
      active_reaction !== null &&
      (active_reaction.f & DERIVED) !== 0 &&
      (type & ROOT_EFFECT) === 0
    ) {
      var derived2 = active_reaction;
      (derived2.effects ??= []).push(e);
    }
  }
  return effect;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn, false);
}
function effect_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
  return () => {
    destroy_effect(effect);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn, true);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect, () => {
          destroy_effect(effect);
          fulfil(undefined);
        });
      } else {
        destroy_effect(effect);
        fulfil(undefined);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn, false);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn, true);
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn, true);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn, true);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if (
    (remove_dom || (effect2.f & HEAD_EFFECT) !== 0) &&
    effect2.nodes !== null &&
    effect2.nodes.end !== null
  ) {
    remove_effect_dom(effect2.nodes.start, effect2.nodes.end);
    removed = true;
  }
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  set_signal_status(effect2, DESTROYED);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (true_default) {
    effect2.component_function = null;
  }
  effect2.next =
    effect2.prev =
    effect2.teardown =
    effect2.ctx =
    effect2.deps =
    effect2.fn =
    effect2.nodes =
    effect2.ac =
      null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null) prev.next = next2;
  if (next2 !== null) next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2) parent.first = next2;
    if (parent.last === effect2) parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy) destroy_effect(effect2);
    if (callback) callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0) return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child = effect2.first;
  while (child !== null) {
    var sibling = child.next;
    var transparent =
      (child.f & EFFECT_TRANSPARENT) !== 0 ||
      ((child.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0);
    pause_children(child, transitions, transparent ? local : false);
    child = sibling;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0) return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    schedule_effect(effect2);
  }
  var child = effect2.first;
  while (child !== null) {
    var sibling = child.next;
    var transparent =
      (child.f & EFFECT_TRANSPARENT) !== 0 || (child.f & BRANCH_EFFECT) !== 0;
    resume_children(child, transparent ? local : false);
    child = sibling;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transition.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes) return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (
    active_reaction !== null &&
    (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)
  ) {
    if (current_sources === null) {
      current_sources = [value];
    } else {
      current_sources.push(value);
    }
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var length = dependencies.length;
    for (var i = 0; i < length; i++) {
      var dependency = dependencies[i];
      if (is_dirty(dependency)) {
        update_derived(dependency);
      }
      if (dependency.wv > reaction.wv) {
        return true;
      }
    }
    if ((flags2 & CONNECTED) !== 0 && batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(
  signal,
  effect2,
  root = true,
) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (
    !async_mode_flag &&
    current_sources !== null &&
    includes.call(current_sources, signal)
  ) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(reaction, effect2, false);
    } else if (effect2 === reaction) {
      if (root) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(reaction);
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction =
    (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = reaction.fn;
    var result = fn();
    reaction.f |= REACTION_RAN;
    var deps = reaction.deps;
    var is_fork = current_batch?.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0; i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps; i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (
      is_runes() &&
      untracked_writes !== null &&
      !untracking &&
      deps !== null &&
      (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0
    ) {
      for (i = 0; i < untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          reaction,
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(...untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = index_of.call(reactions, signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (
    reactions === null &&
    (dependency.f & DERIVED) !== 0 &&
    (new_deps === null || !includes.call(new_deps, dependency))
  ) {
    var derived2 = dependency;
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
      derived2.f &= ~WAS_MARKED;
    }
    update_derived_status(derived2);
    freeze_derived_effects(derived2);
    remove_reactions(derived2, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null) return;
  for (var i = start_index; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  if (true_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = dev_stack;
    set_dev_stack(effect2.dev_stack ?? dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (
      true_default &&
      tracing_mode_flag &&
      (effect2.f & DIRTY) !== 0 &&
      effect2.deps !== null
    ) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (true_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
function get(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  captured_signals?.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed =
      active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (
      !destroyed &&
      (current_sources === null || !includes.call(current_sources, signal))
    ) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (
            new_deps === null &&
            deps !== null &&
            deps[skipped_deps] === signal
          ) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        (active_reaction.deps ??= []).push(signal);
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!includes.call(reactions, active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (true_default) {
    recent_async_deriveds.delete(signal);
    if (
      tracing_mode_flag &&
      !untracking &&
      tracing_expressions !== null &&
      active_reaction !== null &&
      tracing_expressions.reaction === active_reaction
    ) {
      if (signal.trace) {
        signal.trace();
      } else {
        var trace = get_error("traced at");
        if (trace) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === undefined) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace.stack !== last?.stack) {
            entry.traces.push(trace);
          }
        }
      }
    }
  }
  if (is_destroying_effect && old_values.has(signal)) {
    return old_values.get(signal);
  }
  if (is_derived) {
    var derived2 = signal;
    if (is_destroying_effect) {
      var value = derived2.v;
      if (
        ((derived2.f & CLEAN) === 0 && derived2.reactions !== null) ||
        depends_on_old_values(derived2)
      ) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
    var should_connect =
      (derived2.f & CONNECTED) === 0 &&
      !untracking &&
      active_reaction !== null &&
      (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (is_dirty(derived2)) {
      if (should_connect) {
        derived2.f |= CONNECTED;
      }
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  }
  if (batch_values?.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  derived2.f |= CONNECTED;
  if (derived2.deps === null) return;
  for (const dep of derived2.deps) {
    (dep.reactions ??= []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(dep);
      reconnect(dep);
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED) return true;
  if (derived2.deps === null) return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(dep)) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
// node_modules/svelte/src/internal/client/dom/elements/events.js
var event_symbol = Symbol("events");
var all_registered_events = new Set();
var root_event_handles = new Set();
var last_propagated_event = null;
function handle_event_propagation(event) {
  var handler_element = this;
  var owner_document = handler_element.ownerDocument;
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = path[0] || event.target;
  last_propagated_event = event;
  var path_idx = 0;
  var handled_at = last_propagated_event === event && event[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (
      at_idx !== -1 &&
      (handler_element === document || handler_element === window)
    ) {
      event[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    },
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      var parent_element =
        current_target.assignedSlot ||
        current_target.parentNode ||
        current_target.host ||
        null;
      try {
        var delegated = current_target[event_symbol]?.[event_name];
        if (
          delegated != null &&
          (!current_target.disabled || event.target === current_target)
        ) {
          delegated.call(current_target, event);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (
        event.cancelBubble ||
        parent_element === handler_element ||
        parent_element === null
      ) {
        break;
      }
      current_target = parent_element;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event[event_symbol] = handler_element;
    delete event.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
var policy =
  globalThis?.window?.trustedTypes &&
  /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy(
    "svelte-trusted-html",
    {
      createHTML: (html) => {
        return html;
      },
    },
  );
function create_trusted_html(html) {
  return policy?.createHTML(html) ?? html;
}
function create_fragment_from_html(html) {
  var elem = create_element("template");
  elem.innerHTML = create_trusted_html(html.replaceAll("<!>", "<!---->"));
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start, end) {
  var effect2 = active_effect;
  if (effect2.nodes === null) {
    effect2.nodes = { start, end, a: null, t: null };
  }
}
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === undefined) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment) node = get_first_child(node);
    }
    var clone =
      use_import_node || is_firefox
        ? document.importNode(node, true)
        : node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = active_effect;
    if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(dom);
}

// node_modules/svelte/src/utils.js
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
];
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback",
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = ["$state", "$state.raw", "$derived", "$derived.by"];
var RUNES = [
  ...STATE_CREATION_RUNES,
  "$state.eager",
  "$state.snapshot",
  "$props",
  "$props.id",
  "$bindable",
  "$effect",
  "$effect.pre",
  "$effect.tracking",
  "$effect.root",
  "$effect.pending",
  "$inspect",
  "$inspect().with",
  "$inspect.trace",
  "$host",
];

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function mount(component, options) {
  return _mount(component, options);
}
function hydrate(component, options) {
  init_operations();
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (
      anchor &&
      (anchor.nodeType !== COMMENT_NODE || anchor.data !== HYDRATION_START)
    ) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(anchor);
    const instance = _mount(component, { ...options, anchor });
    set_hydrating(false);
    return instance;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message
        .split(
          `
`,
        )
        .some((line) => line.startsWith("https://svelte.dev/e/"))
    ) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var listeners = new Map();
function _mount(
  Component,
  { target, anchor, props = {}, events, context, intro = true, transformError },
) {
  init_operations();
  var component = undefined;
  var unmount = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    boundary(
      anchor_node,
      {
        pending: () => {},
      },
      (anchor_node2) => {
        push({});
        var ctx = component_context;
        if (context) ctx.c = context;
        if (events) {
          props.$$events = events;
        }
        if (hydrating) {
          assign_nodes(anchor_node2, null);
        }
        should_intro = intro;
        component = Component(anchor_node2, props) || {};
        should_intro = true;
        if (hydrating) {
          active_effect.nodes.end = hydrate_node;
          if (
            hydrate_node === null ||
            hydrate_node.nodeType !== COMMENT_NODE ||
            hydrate_node.data !== HYDRATION_END
          ) {
            hydration_mismatch();
            throw HYDRATION_ERROR;
          }
        }
        pop();
      },
      transformError,
    );
    var registered_events = new Set();
    var event_handle = (events2) => {
      for (var i = 0; i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name)) continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === undefined) {
            counts = new Map();
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === undefined) {
            node.addEventListener(event_name, handle_event_propagation, {
              passive,
            });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    return () => {
      for (var event_name of registered_events) {
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          var count = counts.get(event_name);
          if (--count == 0) {
            node.removeEventListener(event_name, handle_event_propagation);
            counts.delete(event_name);
            if (counts.size === 0) {
              listeners.delete(node);
            }
          } else {
            counts.set(event_name, count);
          }
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component, unmount);
  return component;
}
var mounted_components = new WeakMap();
function unmount(component, options) {
  const fn = mounted_components.get(component);
  if (fn) {
    mounted_components.delete(component);
    return fn(options);
  }
  if (true_default) {
    if (STATE_SYMBOL in component) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}
// node_modules/svelte/src/internal/client/dom/blocks/branches.js
class BranchManager {
  anchor;
  #batches = new Map();
  #onscreen = new Map();
  #offscreen = new Map();
  #outroing = new Set();
  #transition = true;
  constructor(anchor, transition = true) {
    this.anchor = anchor;
    this.#transition = transition;
  }
  #commit = () => {
    var batch = current_batch;
    if (!this.#batches.has(batch)) return;
    var key = this.#batches.get(batch);
    var onscreen = this.#onscreen.get(key);
    if (onscreen) {
      resume_effect(onscreen);
      this.#outroing.delete(key);
    } else {
      var offscreen = this.#offscreen.get(key);
      if (offscreen) {
        this.#onscreen.set(key, offscreen.effect);
        this.#offscreen.delete(key);
        offscreen.fragment.lastChild.remove();
        this.anchor.before(offscreen.fragment);
        onscreen = offscreen.effect;
      }
    }
    for (const [b, k] of this.#batches) {
      this.#batches.delete(b);
      if (b === batch) {
        break;
      }
      const offscreen2 = this.#offscreen.get(k);
      if (offscreen2) {
        destroy_effect(offscreen2.effect);
        this.#offscreen.delete(k);
      }
    }
    for (const [k, effect2] of this.#onscreen) {
      if (k === key || this.#outroing.has(k)) continue;
      const on_destroy = () => {
        const keys = Array.from(this.#batches.values());
        if (keys.includes(k)) {
          var fragment = document.createDocumentFragment();
          move_effect(effect2, fragment);
          fragment.append(create_text());
          this.#offscreen.set(k, { effect: effect2, fragment });
        } else {
          destroy_effect(effect2);
        }
        this.#outroing.delete(k);
        this.#onscreen.delete(k);
      };
      if (this.#transition || !onscreen) {
        this.#outroing.add(k);
        pause_effect(effect2, on_destroy, false);
      } else {
        on_destroy();
      }
    }
  };
  #discard = (batch) => {
    this.#batches.delete(batch);
    const keys = Array.from(this.#batches.values());
    for (const [k, branch2] of this.#offscreen) {
      if (!keys.includes(k)) {
        destroy_effect(branch2.effect);
        this.#offscreen.delete(k);
      }
    }
  };
  ensure(key, fn) {
    var batch = current_batch;
    var defer = should_defer_append();
    if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        this.#offscreen.set(key, {
          effect: branch(() => fn(target)),
          fragment,
        });
      } else {
        this.#onscreen.set(
          key,
          branch(() => fn(this.anchor)),
        );
      }
    }
    this.#batches.set(batch, key);
    if (defer) {
      for (const [k, effect2] of this.#onscreen) {
        if (k === key) {
          batch.unskip_effect(effect2);
        } else {
          batch.skip_effect(effect2);
        }
      }
      for (const [k, branch2] of this.#offscreen) {
        if (k === key) {
          batch.unskip_effect(branch2.effect);
        } else {
          batch.skip_effect(branch2.effect);
        }
      }
      batch.oncommit(this.#commit);
      batch.ondiscard(this.#discard);
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      this.#commit();
    }
  }
}

// node_modules/svelte/src/index-client.js
if (true_default) {
  let throw_rune_error = function (rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        get: () => {
          if (value !== undefined) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        },
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}
// node_modules/svelte/src/internal/client/dev/css.js
var all_styles = new Map();
// node_modules/svelte/src/internal/client/dev/elements.js
function add_locations(fn, filename, locations) {
  return (...args) => {
    const dom = fn(...args);
    var node = hydrating
      ? dom
      : dom.nodeType === DOCUMENT_FRAGMENT_NODE
        ? dom.firstChild
        : dom;
    assign_locations(node, filename, locations);
    return dom;
  };
}
function assign_location(element, filename, location2) {
  element.__svelte_meta = {
    parent: dev_stack,
    loc: { file: filename, line: location2[0], column: location2[1] },
  };
  if (location2[2]) {
    assign_locations(element.firstChild, filename, location2[2]);
  }
}
function assign_locations(node, filename, locations) {
  var i = 0;
  var depth = 0;
  while (node && i < locations.length) {
    if (hydrating && node.nodeType === COMMENT_NODE) {
      var comment = node;
      if (
        comment.data === HYDRATION_START ||
        comment.data === HYDRATION_START_ELSE
      )
        depth += 1;
      else if (comment.data[0] === HYDRATION_END) depth -= 1;
    }
    if (depth === 0 && node.nodeType === ELEMENT_NODE) {
      assign_location(node, filename, locations[i++]);
    }
    node = node.nextSibling;
  }
}
// node_modules/svelte/src/internal/client/dev/legacy.js
function check_target(target) {
  if (target) {
    component_api_invalid_new(target[FILENAME] ?? "a component", target.name);
  }
}
function legacy_api() {
  const component = component_context?.function;
  function error(method) {
    component_api_changed(method, component[FILENAME]);
  }
  return {
    $destroy: () => error("$destroy()"),
    $on: () => error("$on(...)"),
    $set: () => error("$set(...)"),
  };
}
// node_modules/svelte/src/internal/client/dom/blocks/key.js
var NAN = Symbol("NaN");
// node_modules/svelte/src/internal/client/timing.js
var now = true_default ? () => performance.now() : () => Date.now();
var raf = {
  tick: (_) => (true_default ? requestAnimationFrame : noop)(_),
  now: () => now(),
  tasks: new Set(),
};
// node_modules/svelte/src/internal/client/dom/blocks/svelte-head.js
function head(hash2, render_fn) {
  let previous_hydrate_node = null;
  let was_hydrating = hydrating;
  var anchor;
  if (hydrating) {
    previous_hydrate_node = hydrate_node;
    var head_anchor = get_first_child(document.head);
    while (
      head_anchor !== null &&
      (head_anchor.nodeType !== COMMENT_NODE || head_anchor.data !== hash2)
    ) {
      head_anchor = get_next_sibling(head_anchor);
    }
    if (head_anchor === null) {
      set_hydrating(false);
    } else {
      var start = get_next_sibling(head_anchor);
      head_anchor.remove();
      set_hydrate_node(start);
    }
  }
  if (!hydrating) {
    anchor = document.head.appendChild(create_text());
  }
  try {
    block(() => render_fn(anchor), HEAD_EFFECT | EFFECT_PRESERVED);
  } finally {
    if (was_hydrating) {
      set_hydrating(true);
      set_hydrate_node(previous_hydrate_node);
    }
  }
}
// node_modules/svelte/src/internal/shared/attributes.js
var replacements = {
  translate: new Map([
    [true, "yes"],
    [false, "no"],
  ]),
};
var whitespace = [
  ...` 	
\r\f \v\uFEFF`,
];

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
var setters_cache = new Map();
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
var pending = new Set();
// node_modules/svelte/src/internal/client/dom/elements/bindings/size.js
class ResizeObserverSingleton {
  #listeners = new WeakMap();
  #observer;
  #options;
  static entries = new WeakMap();
  constructor(options) {
    this.#options = options;
  }
  observe(element, listener) {
    var listeners2 = this.#listeners.get(element) || new Set();
    listeners2.add(listener);
    this.#listeners.set(element, listeners2);
    this.#getObserver().observe(element, this.#options);
    return () => {
      var listeners3 = this.#listeners.get(element);
      listeners3.delete(listener);
      if (listeners3.size === 0) {
        this.#listeners.delete(element);
        this.#observer.unobserve(element);
      }
    };
  }
  #getObserver() {
    return (
      this.#observer ??
      (this.#observer = new ResizeObserver((entries) => {
        for (var entry of entries) {
          ResizeObserverSingleton.entries.set(entry.target, entry);
          for (var listener of this.#listeners.get(entry.target) || []) {
            listener(entry);
          }
        }
      }))
    );
  }
}
// node_modules/svelte/src/internal/client/reactivity/store.js
var is_store_binding = false;
var IS_UNMOUNTED = Symbol();
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/internal/client/reactivity/props.js
function prop(props, key, flags2, fallback) {
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = fallback;
  var fallback_dirty = true;
  var get_fallback = () => {
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(fallback) : fallback;
    }
    return fallback_value;
  };
  var setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter =
      get_descriptor(props, key)?.set ??
      (is_entry_props && key in props ? (v) => (props[key] = v) : undefined);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
  } else {
    initial_value = props[key];
  }
  if (initial_value === undefined && fallback !== undefined) {
    initial_value = get_fallback();
    if (setter) {
      if (runes) props_invalid_value(key);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = props[key];
      if (value === undefined) return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = props[key];
      if (value !== undefined) {
        fallback_value = undefined;
      }
      return value === undefined ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return function (value, mutation) {
      if (arguments.length > 0) {
        if (!runes || !mutation || legacy_parent || is_store_sub) {
          setter(mutation ? getter() : value);
        }
        return value;
      }
      return getter();
    };
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(
    () => {
      overridden = false;
      return getter();
    },
  );
  if (true_default) {
    d.label = key;
  }
  if (bindable) get(d);
  var parent_effect = active_effect;
  return function (value, mutation) {
    if (arguments.length > 0) {
      const new_value = mutation
        ? get(d)
        : runes && bindable
          ? proxy(value)
          : value;
      set(d, new_value);
      overridden = true;
      if (fallback_value !== undefined) {
        fallback_value = new_value;
      }
      return value;
    }
    if (
      (is_destroying_effect && overridden) ||
      (parent_effect.f & DESTROYED) !== 0
    ) {
      return d.v;
    }
    return get(d);
  };
}
// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
class Svelte4Component {
  #events;
  #instance;
  constructor(options) {
    var sources = new Map();
    var add_source = (key, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key, s);
      return s;
    };
    const props = new Proxy(
      { ...(options.props || {}), $$events: {} },
      {
        get(target, prop2) {
          return get(
            sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)),
          );
        },
        has(target, prop2) {
          if (prop2 === LEGACY_PROPS) return true;
          get(
            sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)),
          );
          return Reflect.has(target, prop2);
        },
        set(target, prop2, value) {
          set(sources.get(prop2) ?? add_source(prop2, value), value);
          return Reflect.set(target, prop2, value);
        },
      },
    );
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError,
    });
    if (
      !async_mode_flag &&
      (!options?.props?.$$host || options.sync === false)
    ) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key of Object.keys(this.#instance)) {
      if (key === "$set" || key === "$destroy" || key === "$on") continue;
      define_property(this, key, {
        get() {
          return this.#instance[key];
        },
        set(value) {
          this.#instance[key] = value;
        },
        enumerable: true,
      });
    }
    this.#instance.$set = (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  $set(props) {
    this.#instance.$set(props);
  }
  $on(event2, callback) {
    this.#events[event2] = this.#events[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event2].push(cb);
    return () => {
      this.#events[event2] = this.#events[event2].filter((fn) => fn !== cb);
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    $$ctor;
    $$s;
    $$c;
    $$cn = false;
    $$d = {};
    $$r = false;
    $$p_d = {};
    $$l = {};
    $$l_u = new Map();
    $$me;
    $$shadowRoot = null;
    constructor($$componentCtor, $$slots, shadow_root_init) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (shadow_root_init) {
        this.$$shadowRoot = this.attachShadow(shadow_root_init);
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function (name) {
          return (anchor) => {
            const slot = create_element("slot");
            if (name !== "default") slot.name = name;
            append(anchor, slot);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(
              name,
              attribute.value,
              this.$$p_d,
              "toProp",
            );
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== undefined) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.$$shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this,
          },
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            this.$$r = true;
            for (const key of object_keys(this.$$c)) {
              if (!this.$$p_d[key]?.reflect) continue;
              this.$$d[key] = this.$$c[key];
              const attribute_value = get_custom_element_value(
                key,
                this.$$d[key],
                this.$$p_d,
                "toAttribute",
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(
                  this.$$p_d[key].attribute || key,
                  attribute_value,
                );
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      if (this.$$r) return;
      attr = this.$$g_p(attr);
      this.$$d[attr] = get_custom_element_value(
        attr,
        newValue,
        this.$$p_d,
        "toProp",
      );
      this.$$c?.$set({ [attr]: this.$$d[attr] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = undefined;
        }
      });
    }
    $$g_p(attribute_name) {
      return (
        object_keys(this.$$p_d).find(
          (key) =>
            this.$$p_d[key].attribute === attribute_name ||
            (!this.$$p_d[key].attribute &&
              key.toLowerCase() === attribute_name),
        ) || attribute_name
      );
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  const type = props_definition[prop2]?.type;
  value =
    type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element) {
  const result = {};
  element.childNodes.forEach((node) => {
    result[node.slot || "default"] = true;
  });
  return result;
}
// src/frontend/svelte/client/pages/TestPage.js
TestPage[FILENAME] = "src/frontend/svelte/pages/TestPage.js";
var root = add_locations(
  from_html(`<main><h1>TestPage</h1></main>`),
  TestPage[FILENAME],
  [[5, 0, [[5, 6]]]],
);
function TestPage($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, TestPage);
  let cssPath = prop($$props, "cssPath", 3, "");
  var $$exports = { ...legacy_api() };
  var main = root();
  head("yqfbse", ($$anchor2) => {
    effect(() => {
      $document.title = "TestPage";
    });
  });
  append($$anchor, main);
  return pop($$exports);
}

// node_modules/@absolutejs/absolute/types/client.ts
var hmrState = {
  isConnected: false,
  isFirstHMRUpdate: true,
  isHMRUpdating: false,
  pingInterval: null,
  reconnectTimeout: null,
};

// node_modules/@absolutejs/absolute/dist/dev/client/constants.ts
var ANGULAR_INIT_TIMEOUT_MS = 500;
var CSS_ERROR_RESOLVE_DELAY_MS = 50;
var CSS_MAX_CHECK_ATTEMPTS = 10;
var CSS_MAX_PARSE_TIMEOUT_MS = 500;
var CSS_SHEET_READY_TIMEOUT_MS = 100;
var DOM_UPDATE_DELAY_MS = 50;
var FOCUS_ID_PREFIX_LENGTH = 3;
var FOCUS_IDX_PREFIX_LENGTH = 4;
var FOCUS_NAME_PREFIX_LENGTH = 5;
var HMR_UPDATE_TIMEOUT_MS = 2000;
var MAX_RECONNECT_ATTEMPTS = 60;
var OVERLAY_FADE_DURATION_MS = 150;
var PING_INTERVAL_MS = 30000;
var RAF_BATCH_COUNT = 3;
var REBUILD_RELOAD_DELAY_MS = 200;
var RECONNECT_INITIAL_DELAY_MS = 500;
var RECONNECT_POLL_INTERVAL_MS = 300;
var SVELTE_CSS_LOAD_TIMEOUT_MS = 500;
var UNFOUND_INDEX = -1;
var WEBSOCKET_NORMAL_CLOSURE = 1000;

// node_modules/@absolutejs/absolute/dist/dev/client/frameworkDetect.ts
var detectCurrentFramework = () => {
  if (window.__HMR_FRAMEWORK__) return window.__HMR_FRAMEWORK__;
  const path = window.location.pathname;
  if (path === "/vue" || path.startsWith("/vue/")) return "vue";
  if (path === "/svelte" || path.startsWith("/svelte/")) return "svelte";
  if (path === "/angular" || path.startsWith("/angular/")) return "angular";
  if (path === "/htmx" || path.startsWith("/htmx/")) return "htmx";
  if (path === "/html" || path.startsWith("/html/")) return "html";
  if (path === "/") return "html";
  if (path === "/react" || path.startsWith("/react/")) return "react";
  if (window.__REACT_ROOT__) return "react";
  return null;
};
var findIndexPath = (manifest, sourceFile, framework) => {
  if (!manifest) return null;
  if (sourceFile) {
    const componentName = getComponentNameFromPath(sourceFile);
    const indexKey = componentName ? `${componentName}Index` : null;
    if (indexKey && manifest[indexKey]) {
      return manifest[indexKey];
    }
  }
  const frameworkPatterns = {
    angular: /angular/i,
    react: /react/i,
    svelte: /svelte/i,
    vue: /vue/i,
  };
  const pattern = frameworkPatterns[framework];
  for (const key2 in manifest) {
    const value = manifest[key2];
    if (
      key2.endsWith("Index") &&
      value &&
      (!pattern || pattern.test(key2) || value.includes(`/${framework}/`))
    ) {
      return value;
    }
  }
  return null;
};
var getComponentNameFromPath = (filePath) => {
  if (!filePath) return null;
  const parts = filePath.replace(/\\/g, "/").split("/");
  const fileName = parts[parts.length - 1] || "";
  const baseName = fileName.replace(/\.(tsx?|jsx?|vue|svelte|html)$/, "");
  return baseName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

// node_modules/@absolutejs/absolute/dist/dev/client/errorOverlay.ts
var errorOverlayElement = null;
var currentOverlayKind = null;
var frameworkLabels = {
  angular: "Angular",
  assets: "Assets",
  html: "HTML",
  htmx: "HTMX",
  react: "React",
  svelte: "Svelte",
  unknown: "Unknown",
  vue: "Vue",
};
var frameworkColors = {
  angular: "#dd0031",
  assets: "#563d7c",
  html: "#e34c26",
  htmx: "#1a365d",
  react: "#61dafb",
  svelte: "#ff3e00",
  unknown: "#94a3b8",
  vue: "#42b883",
};
var removeOverlayElement = () => {
  if (errorOverlayElement && errorOverlayElement.parentNode) {
    errorOverlayElement.parentNode.removeChild(errorOverlayElement);
  }
  errorOverlayElement = null;
  currentOverlayKind = null;
};
var hideErrorOverlay = () => {
  const elm = errorOverlayElement;
  if (!elm || !elm.parentNode) {
    removeOverlayElement();
    return;
  }
  elm.style.transition = "opacity 150ms ease-out";
  elm.style.opacity = "0";
  errorOverlayElement = null;
  currentOverlayKind = null;
  setTimeout(() => {
    if (elm.parentNode) elm.parentNode.removeChild(elm);
  }, OVERLAY_FADE_DURATION_MS);
};
var isRuntimeErrorOverlay = () => currentOverlayKind === "runtime";
var buildLocationSection = (file, line, column, lineText) => {
  if (!file && line === undefined && column === undefined && !lineText) {
    return null;
  }
  const locSection = document.createElement("div");
  locSection.style.cssText = "margin-bottom:20px;";
  const locLabel = document.createElement("div");
  locLabel.style.cssText =
    "font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:8px;";
  locLabel.textContent = "Where";
  locSection.appendChild(locLabel);
  const locParts = [];
  if (file) locParts.push(file);
  if (line !== undefined) locParts.push(String(line));
  if (column !== undefined) locParts.push(String(column));
  const loc = locParts.join(":") || "Unknown location";
  const locEl = document.createElement("div");
  locEl.style.cssText =
    "padding:12px 20px;background:rgba(71,85,105,0.3);border-radius:10px;border:1px solid rgba(71,85,105,0.4);color:#cbd5e1;font-size:13px;";
  locEl.textContent = loc;
  locSection.appendChild(locEl);
  if (lineText) {
    const codeBlock = document.createElement("pre");
    codeBlock.style.cssText =
      "margin:8px 0 0;padding:14px 20px;background:rgba(15,23,42,0.8);border-radius:10px;border:1px solid rgba(71,85,105,0.4);color:#94a3b8;font-size:13px;overflow-x:auto;white-space:pre;";
    codeBlock.textContent = lineText;
    locSection.appendChild(codeBlock);
  }
  return locSection;
};
var showErrorOverlay = (opts) => {
  const message = opts.message || "Build failed";
  const { file } = opts;
  const { line } = opts;
  const { column } = opts;
  const { lineText } = opts;
  const framework = (opts.framework || "unknown").toLowerCase();
  const frameworkLabel = frameworkLabels[framework] || framework;
  const accent = frameworkColors[framework] || "#94a3b8";
  removeOverlayElement();
  currentOverlayKind = opts.kind || "compilation";
  const overlay = document.createElement("div");
  overlay.id = "absolutejs-error-overlay";
  overlay.setAttribute("data-hmr-overlay", "true");
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;background:linear-gradient(135deg,rgba(15,23,42,0.98) 0%,rgba(30,41,59,0.98) 100%);backdrop-filter:blur(12px);color:#e2e8f0;font-family:"JetBrains Mono","Fira Code",ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:14px;line-height:1.6;overflow:auto;padding:32px;box-sizing:border-box;display:flex;align-items:flex-start;justify-content:center;';
  const card = document.createElement("div");
  card.style.cssText =
    "max-width:720px;width:100%;background:rgba(30,41,59,0.6);border:1px solid rgba(71,85,105,0.5);border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05);overflow:hidden;";
  const header = document.createElement("div");
  header.style.cssText =
    "display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:rgba(15,23,42,0.5);border-bottom:1px solid rgba(71,85,105,0.4);";
  header.innerHTML = `<div style="display:flex;align-items:center;gap:12px;"><span style="font-weight:700;font-size:20px;color:#fff;letter-spacing:-0.02em;">AbsoluteJS</span><span style="padding:5px 10px;border-radius:8px;font-size:12px;font-weight:600;background:${accent};color:#fff;opacity:0.95;box-shadow:0 2px 4px rgba(0,0,0,0.2);">${frameworkLabel}</span></div><span style="color:#94a3b8;font-size:13px;font-weight:500;">${opts.kind === "runtime" ? "Runtime Error" : "Compilation Error"}</span>`;
  card.appendChild(header);
  const content = document.createElement("div");
  content.style.cssText = "padding:24px;";
  const errorSection = document.createElement("div");
  errorSection.style.cssText = "margin-bottom:20px;";
  const errorLabel = document.createElement("div");
  errorLabel.style.cssText =
    "font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:8px;";
  errorLabel.textContent = "What went wrong";
  errorSection.appendChild(errorLabel);
  const msgEl = document.createElement("pre");
  msgEl.style.cssText =
    "margin:0;padding:16px 20px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);border-radius:10px;overflow-x:auto;white-space:pre-wrap;word-break:break-word;color:#fca5a5;font-size:13px;line-height:1.5;";
  msgEl.textContent = message;
  errorSection.appendChild(msgEl);
  content.appendChild(errorSection);
  const locSection = buildLocationSection(file, line, column, lineText);
  if (locSection) {
    content.appendChild(locSection);
  }
  const footer = document.createElement("div");
  footer.style.cssText =
    "display:flex;justify-content:flex-end;padding-top:8px;";
  const dismiss = document.createElement("button");
  dismiss.textContent = "Dismiss";
  dismiss.style.cssText = `padding:10px 20px;background:${accent};color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:opacity 0.15s,transform 0.15s;`;
  dismiss.onmouseover = function () {
    dismiss.style.opacity = "0.9";
    dismiss.style.transform = "translateY(-1px)";
  };
  dismiss.onmouseout = function () {
    dismiss.style.opacity = "1";
    dismiss.style.transform = "translateY(0)";
  };
  dismiss.onclick = hideErrorOverlay;
  footer.appendChild(dismiss);
  content.appendChild(footer);
  card.appendChild(content);
  overlay.appendChild(card);
  if (!document.body) return;
  document.body.appendChild(overlay);
  errorOverlayElement = overlay;
};

// node_modules/@absolutejs/absolute/dist/dev/client/domState.ts
var trySetSelectionRange = (element2, start, end) => {
  try {
    element2.setSelectionRange(start, end);
  } catch {}
};
var restoreSelectionRange = (element2, entry) => {
  if (
    entry.selStart === undefined ||
    entry.selEnd === undefined ||
    !element2.setSelectionRange
  )
    return;
  trySetSelectionRange(element2, entry.selStart, entry.selEnd);
};
var restoreInputEntry = (target, entry) => {
  if (!(target instanceof HTMLInputElement)) return;
  const input = target;
  const type = entry.type || input.getAttribute("type") || "text";
  if (type === "checkbox" || type === "radio") {
    if (entry.checked !== undefined) input.checked = entry.checked;
  } else if (entry.value !== undefined) {
    input.value = entry.value;
  }
  restoreSelectionRange(input, entry);
};
var restoreTextareaEntry = (target, entry) => {
  if (!(target instanceof HTMLTextAreaElement)) return;
  const textarea = target;
  if (entry.value !== undefined) textarea.value = entry.value;
  restoreSelectionRange(textarea, entry);
};
var restoreSelectEntry = (target, entry) => {
  if (!Array.isArray(entry.values)) return;
  if (!(target instanceof HTMLSelectElement)) return;
  const select = target;
  const { values } = entry;
  Array.from(select.options).forEach((opt) => {
    opt.selected = values.indexOf(opt.value) !== UNFOUND_INDEX;
  });
};
var restoreEntry = (target, entry) => {
  if (target.tagName === "INPUT") {
    restoreInputEntry(target, entry);
    return;
  }
  if (target.tagName === "TEXTAREA") {
    restoreTextareaEntry(target, entry);
    return;
  }
  if (target.tagName === "SELECT") {
    restoreSelectEntry(target, entry);
    return;
  }
  if (target.tagName === "OPTION") {
    if (entry.selected !== undefined && target instanceof HTMLOptionElement)
      target.selected = entry.selected;
    return;
  }
  if (target.tagName === "DETAILS") {
    if (entry.open !== undefined && target instanceof HTMLDetailsElement)
      target.open = entry.open;
    return;
  }
  if (target.getAttribute("contenteditable") === "true") {
    if (entry.text !== undefined) target.textContent = entry.text;
  }
};
var findEntryTarget = (root2, elements, entry) => {
  if (entry.id) return root2.querySelector(`#${CSS.escape(entry.id)}`);
  if (entry.name)
    return root2.querySelector(`[name="${CSS.escape(entry.name)}"]`);
  if (elements[entry.idx]) return elements[entry.idx] ?? null;
  return null;
};
var resolveFocusElement = (root2, elements, activeKey) => {
  if (activeKey.startsWith("id:"))
    return root2.querySelector(
      `#${CSS.escape(activeKey.slice(FOCUS_ID_PREFIX_LENGTH))}`,
    );
  if (activeKey.startsWith("name:"))
    return root2.querySelector(
      `[name="${CSS.escape(activeKey.slice(FOCUS_NAME_PREFIX_LENGTH))}"]`,
    );
  if (!activeKey.startsWith("idx:")) return null;
  const idx = parseInt(activeKey.slice(FOCUS_IDX_PREFIX_LENGTH), 10);
  if (isNaN(idx) || !elements[idx]) return null;
  return elements[idx];
};
var restoreDOMState = (root2, snapshot2) => {
  if (!snapshot2 || !snapshot2.items) return;
  const selector =
    'input, textarea, select, option, [contenteditable="true"], details';
  const elements = root2.querySelectorAll(selector);
  snapshot2.items.forEach((entry) => {
    const target = findEntryTarget(root2, elements, entry);
    if (!target) return;
    restoreEntry(target, entry);
  });
  if (!snapshot2.activeKey) return;
  const focusEl = resolveFocusElement(root2, elements, snapshot2.activeKey);
  if (focusEl instanceof HTMLElement) {
    focusEl.focus();
  }
};
var resolveFormElement = (isStandalone, form, name) => {
  if (isStandalone) {
    const element2 = document.querySelector(
      `input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`,
    );
    if (element2) return element2;
    const byId = document.getElementById(name);
    if (byId instanceof HTMLInputElement) return byId;
    return null;
  }
  if (!form) return null;
  const found = form.querySelector(`[name="${name}"], #${name}`);
  if (
    found instanceof HTMLInputElement ||
    found instanceof HTMLTextAreaElement ||
    found instanceof HTMLSelectElement
  )
    return found;
  return null;
};
var applyFormValue = (element2, value) => {
  if (
    element2 instanceof HTMLInputElement &&
    (element2.type === "checkbox" || element2.type === "radio")
  ) {
    element2.checked = value === true;
    return;
  }
  element2.value = String(value);
};
var resolveForm = (formId) => {
  const formIndex = parseInt(formId.replace("form-", ""));
  const form = document.getElementById(formId);
  if (form) return form;
  if (isNaN(formIndex)) return null;
  try {
    return document.querySelector(`form:nth-of-type(${formIndex + 1})`);
  } catch {
    return null;
  }
};
var restoreRadioGroup = (isStandalone, form, groupName, selectedValue) => {
  const scope = isStandalone ? document : form;
  if (!scope) return;
  const escapedName = CSS.escape(groupName);
  const escapedValue = CSS.escape(selectedValue);
  const radio = scope.querySelector(
    `input[type="radio"][name="${escapedName}"][value="${escapedValue}"]`,
  );
  if (radio) {
    radio.checked = true;
  }
};
var RADIO_PREFIX = "__radio__";
var restoreFormState = (formState) => {
  Object.keys(formState).forEach((formId) => {
    const isStandalone = formId === "__standalone__";
    const form = isStandalone ? null : resolveForm(formId);
    const formData = formState[formId];
    if (!formData) return;
    Object.keys(formData).forEach((name) => {
      if (name.startsWith(RADIO_PREFIX)) {
        const groupName = name.slice(RADIO_PREFIX.length);
        const value2 = formData[name];
        if (value2 === undefined) return;
        restoreRadioGroup(isStandalone, form, groupName, String(value2));
        return;
      }
      const element2 = resolveFormElement(isStandalone, form, name);
      if (!element2) return;
      const value = formData[name];
      if (value === undefined) return;
      applyFormValue(element2, value);
    });
  });
};
var restoreScrollState = (scrollState) => {
  if (scrollState && scrollState.window) {
    window.scrollTo(scrollState.window.x, scrollState.window.y);
  }
};
var saveInputEntry = (elem, entry) => {
  if (!(elem instanceof HTMLInputElement)) return;
  const input = elem;
  const type = input.getAttribute("type") || "text";
  entry.type = type;
  if (type === "checkbox" || type === "radio") {
    entry.checked = input.checked;
  } else {
    entry.value = input.value;
  }
  if (input.selectionStart !== null && input.selectionEnd !== null) {
    entry.selStart = input.selectionStart;
    entry.selEnd = input.selectionEnd;
  }
};
var saveTextareaEntry = (elem, entry) => {
  if (!(elem instanceof HTMLTextAreaElement)) return;
  const textarea = elem;
  entry.value = textarea.value;
  if (textarea.selectionStart !== null && textarea.selectionEnd !== null) {
    entry.selStart = textarea.selectionStart;
    entry.selEnd = textarea.selectionEnd;
  }
};
var saveSelectEntry = (elem, entry) => {
  if (!(elem instanceof HTMLSelectElement)) return;
  const select = elem;
  const vals = [];
  Array.from(select.options).forEach((opt) => {
    if (opt.selected) vals.push(opt.value);
  });
  entry.values = vals;
};
var saveElementEntry = (elem, entry) => {
  if (elem.tagName === "INPUT") {
    saveInputEntry(elem, entry);
    return;
  }
  if (elem.tagName === "TEXTAREA") {
    saveTextareaEntry(elem, entry);
    return;
  }
  if (elem.tagName === "SELECT") {
    saveSelectEntry(elem, entry);
    return;
  }
  if (elem.tagName === "OPTION") {
    if (elem instanceof HTMLOptionElement) entry.selected = elem.selected;
    return;
  }
  if (elem.tagName === "DETAILS") {
    if (elem instanceof HTMLDetailsElement) entry.open = elem.open;
    return;
  }
  if (elem.getAttribute("contenteditable") === "true") {
    entry.text = elem.textContent || undefined;
  }
};
var saveDOMState = (root2) => {
  const snapshot2 = { activeKey: null, items: [] };
  const selector =
    'input, textarea, select, option, [contenteditable="true"], details';
  const elements = root2.querySelectorAll(selector);
  elements.forEach((el, idx) => {
    const entry = {
      idx,
      tag: el.tagName.toLowerCase(),
    };
    const id2 = el.getAttribute("id");
    const name2 = el.getAttribute("name");
    if (id2) entry.id = id2;
    else if (name2) entry.name = name2;
    saveElementEntry(el, entry);
    snapshot2.items.push(entry);
  });
  const active = document.activeElement;
  if (!active || !root2.contains(active)) return snapshot2;
  const id = active.getAttribute("id");
  const name = active.getAttribute("name");
  if (id) snapshot2.activeKey = `id:${id}`;
  else if (name) snapshot2.activeKey = `name:${name}`;
  else
    snapshot2.activeKey = `idx:${Array.prototype.indexOf.call(elements, active)}`;
  return snapshot2;
};
var collectInputState = (element2, name, target) => {
  if (element2.type === "radio") {
    if (element2.checked) target[`__radio__${name}`] = element2.value;
    return;
  }
  if (element2.type === "checkbox") {
    target[name] = element2.checked;
    return;
  }
  target[name] = element2.value;
};
var saveFormState = () => {
  const formState = {};
  const forms = document.querySelectorAll("form");
  forms.forEach((form, formIndex) => {
    const formId = form.id || `form-${formIndex}`;
    const formData = {};
    formState[formId] = formData;
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      if (!(input instanceof HTMLInputElement)) return;
      const name =
        input.name || input.id || `input-${formIndex}-${inputs.length}`;
      collectInputState(input, name, formData);
    });
  });
  const standaloneInputs = document.querySelectorAll(
    "input:not(form input), textarea:not(form textarea), select:not(form select)",
  );
  if (standaloneInputs.length <= 0) return formState;
  const standaloneData = {};
  formState["__standalone__"] = standaloneData;
  standaloneInputs.forEach((input) => {
    if (!(input instanceof HTMLInputElement)) return;
    const name =
      input.name || input.id || `standalone-${standaloneInputs.length}`;
    collectInputState(input, name, standaloneData);
  });
  return formState;
};
var saveScrollState = () => {
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  return {
    window: { x: scrollX, y: scrollY },
  };
};

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/angular.ts
var swapStylesheet = (cssUrl, cssBaseName, framework) => {
  let existingLink = null;
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const linkEl = link instanceof HTMLLinkElement ? link : null;
    const href = linkEl?.getAttribute("href") ?? "";
    if (href.includes(cssBaseName) || href.includes(framework)) {
      existingLink = linkEl;
    }
  });
  if (!existingLink) return;
  const capturedExisting = existingLink;
  const newLink = document.createElement("link");
  newLink.rel = "stylesheet";
  newLink.href = `${cssUrl}?t=${Date.now()}`;
  newLink.onload = function () {
    if (capturedExisting && capturedExisting.parentNode)
      capturedExisting.remove();
  };
  document.head.appendChild(newLink);
};
var readDomCounter = (element2, properties) => {
  element2
    .querySelectorAll('[class*="value"], [class*="count"]')
    .forEach((stateEl) => {
      const text2 = stateEl.textContent;
      if (text2 === null || text2.trim() === "") return;
      const num = parseInt(text2.trim(), 10);
      if (!isNaN(num)) properties["__dom_counter"] = num;
    });
};
var copyInstanceProperty = (instance, key2, properties) => {
  if (key2.startsWith("ɵ") || key2.startsWith("__")) return;
  const val = instance[key2];
  if (typeof val === "function") return;
  properties[key2] = val;
};
var captureInstanceProperties = (ngApi, element2, properties) => {
  if (!ngApi || typeof ngApi.getComponent !== "function") return;
  try {
    const instance = ngApi.getComponent(element2);
    if (!instance) return;
    const record = instance;
    Object.keys(record).forEach((key2) => {
      copyInstanceProperty(record, key2, properties);
    });
  } catch {}
};
var captureComponentState = () => {
  const snapshots = [];
  const selectorCounts = new Map();
  const ngApi = window.ng;
  document.querySelectorAll("*").forEach((elem) => {
    const tagName = elem.tagName.toLowerCase();
    if (!tagName.includes("-")) return;
    const count = selectorCounts.get(tagName) || 0;
    selectorCounts.set(tagName, count + 1);
    const properties = {};
    readDomCounter(elem, properties);
    captureInstanceProperties(ngApi, elem, properties);
    if (Object.keys(properties).length > 0) {
      snapshots.push({ index: count, properties, selector: tagName });
    }
  });
  return snapshots;
};
var safeSetProperty = (instance, key2, value) => {
  try {
    instance[key2] = value;
  } catch {}
};
var restoreInstanceProperties = (instance, snap) => {
  const domCounter = snap.properties["__dom_counter"];
  Object.entries(snap.properties).forEach(([key2, value]) => {
    if (key2 === "__dom_counter") return;
    safeSetProperty(instance, key2, value);
  });
  if (
    domCounter !== undefined &&
    typeof domCounter === "number" &&
    "count" in instance
  ) {
    instance["count"] = domCounter;
  }
};
var restoreViaInstance = (ngApi, element2, snap) => {
  if (!ngApi || typeof ngApi.getComponent !== "function") return false;
  try {
    const instance = ngApi.getComponent(element2);
    if (!instance) return false;
    const record = instance;
    restoreInstanceProperties(record, snap);
    if (typeof ngApi.applyChanges === "function") ngApi.applyChanges(element2);
    return true;
  } catch {
    return false;
  }
};
var restoreDomFallback = (element2, snap) => {
  const domCounter = snap.properties["__dom_counter"];
  if (domCounter === undefined) return;
  element2
    .querySelectorAll('[class*="value"], [class*="count"]')
    .forEach((counterEl) => {
      counterEl.textContent = String(domCounter);
    });
};
var restoreComponentState = (snapshots) => {
  const ngApi = window.ng;
  if (snapshots.length === 0) return;
  const bySelector = new Map();
  for (const snap of snapshots) {
    const list = bySelector.get(snap.selector) || [];
    list.push(snap);
    bySelector.set(snap.selector, list);
  }
  bySelector.forEach((snaps, selector) => {
    const elements = document.querySelectorAll(selector);
    snaps.forEach((snap) => {
      const element2 = elements[snap.index];
      if (!element2) return;
      const restored = restoreViaInstance(ngApi, element2, snap);
      if (!restored) restoreDomFallback(element2, snap);
    });
  });
};
var waitForAngularApp = () => {
  if (window.__ANGULAR_APP__) return Promise.resolve();
  return new Promise((resolve) => {
    const timeout = setTimeout(resolve, ANGULAR_INIT_TIMEOUT_MS);
    let stored = window.__ANGULAR_APP__;
    Object.defineProperty(window, "__ANGULAR_APP__", {
      configurable: true,
      enumerable: true,
      get() {
        return stored;
      },
      set(val) {
        stored = val;
        Object.defineProperty(window, "__ANGULAR_APP__", {
          configurable: true,
          enumerable: true,
          value: val,
          writable: true,
        });
        clearTimeout(timeout);
        resolve();
      },
    });
  });
};
var suppressNg0912 = () => {
  const origWarn = console.warn;
  console.warn = function (...args) {
    if (typeof args[0] === "string" && args[0].includes("NG0912")) return;
    origWarn.apply(console, args);
  };
  return origWarn;
};
var handleAngularUpdate = (message) => {
  if (detectCurrentFramework() !== "angular") return;
  const updateType = message.data.updateType || "logic";
  if (
    (updateType === "style" || updateType === "css-only") &&
    message.data.cssUrl
  ) {
    swapStylesheet(
      message.data.cssUrl,
      message.data.cssBaseName || "",
      "angular",
    );
    return;
  }
  handleFullUpdate(message);
};
var findRootSelector = (container) => {
  const candidates = container.querySelectorAll("*");
  for (let idx = 0; idx < candidates.length; idx++) {
    const candidate = candidates[idx];
    if (!candidate) continue;
    const tag2 = candidate.tagName.toLowerCase();
    if (tag2.includes("-")) return tag2;
  }
  return null;
};
var destroyAngularApp = () => {
  if (!window.__ANGULAR_APP__) return;
  try {
    window.__ANGULAR_APP__.destroy();
  } catch {}
  window.__ANGULAR_APP__ = null;
};
var bootstrapAngularModule = async (indexPath, rootSelector, rootContainer) => {
  if (rootSelector && !rootContainer.querySelector(rootSelector)) {
    rootContainer.appendChild(document.createElement(rootSelector));
  }
  window.__HMR_SKIP_HYDRATION__ = true;
  const origWarn = suppressNg0912();
  await import(`${indexPath}?t=${Date.now()}`);
  await waitForAngularApp();
  console.warn = origWarn;
};
var tickAngularApp = () => {
  if (!window.__ANGULAR_APP__) return;
  try {
    window.__ANGULAR_APP__.tick();
  } catch {}
};
var runWithViewTransition = (updateFn) => {
  const doc = document;
  if (typeof doc.startViewTransition !== "function") {
    updateFn().catch((err) => {
      console.warn("[HMR] Angular update failed (non-fatal):", err);
    });
    return;
  }
  let styleEl = null;
  try {
    styleEl = document.createElement("style");
    styleEl.textContent =
      "::view-transition-old(root),::view-transition-new(root){animation:none!important}";
    document.head.appendChild(styleEl);
  } catch {}
  const removeStyle = () => {
    if (styleEl && styleEl.parentNode) styleEl.remove();
  };
  doc
    .startViewTransition(async () => {
      await updateFn();
    })
    .finished.then(removeStyle)
    .catch(removeStyle);
};
var handleFullUpdate = (message) => {
  const componentState = captureComponentState();
  const scrollState = saveScrollState();
  const formState = saveFormState();
  if (message.data.cssUrl) {
    swapStylesheet(
      message.data.cssUrl,
      message.data.cssBaseName || "",
      "angular",
    );
  }
  const rootContainer = document.getElementById("root") || document.body;
  const rootSelector = findRootSelector(rootContainer);
  const indexPath = findIndexPath(
    message.data.manifest,
    message.data.sourceFile,
    "angular",
  );
  if (!indexPath) return;
  const doUpdate = async () => {
    destroyAngularApp();
    await bootstrapAngularModule(indexPath, rootSelector, rootContainer);
    restoreComponentState(componentState);
    tickAngularApp();
    restoreFormState(formState);
    restoreScrollState(scrollState);
  };
  runWithViewTransition(doUpdate);
};

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/react.ts
var handleReactUpdate = (message) => {
  const currentFramework = detectCurrentFramework();
  if (currentFramework !== "react") return;
  const hasComponentChanges = message.data.hasComponentChanges !== false;
  const hasCSSChanges = message.data.hasCSSChanges === true;
  const cssPath =
    message.data.manifest && message.data.manifest.ReactExampleCSS;
  if (!hasComponentChanges && hasCSSChanges && cssPath) {
    reloadReactCSS(cssPath);
    return;
  }
  const componentKey = window.__REACT_COMPONENT_KEY__;
  const newUrl = componentKey && message.data.manifest?.[componentKey];
  const refreshRuntime = window.$RefreshRuntime$;
  if (newUrl && refreshRuntime) {
    import(`${newUrl}?t=${Date.now()}`)
      .then(() => {
        refreshRuntime.performReactRefresh();
        if (window.__ERROR_BOUNDARY__) {
          window.__ERROR_BOUNDARY__.reset();
        } else {
          hideErrorOverlay();
        }
        return;
      })
      .catch((err) => {
        console.warn(
          "[HMR] React Fast Refresh failed, falling back to reload:",
          err,
        );
        window.location.reload();
      });
    return;
  }
  window.location.reload();
};
var reloadReactCSS = (cssPath) => {
  const existingCSSLinks = document.head.querySelectorAll(
    'link[rel="stylesheet"]',
  );
  existingCSSLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }
    const hrefBase = (href.split("?")[0] ?? "").split("/").pop() ?? "";
    const cssPathBase = (cssPath.split("?")[0] ?? "").split("/").pop() ?? "";
    if (
      hrefBase === cssPathBase ||
      href.includes("react-example") ||
      cssPathBase.includes(hrefBase)
    ) {
      const newHref = `${cssPath + (cssPath.includes("?") ? "&" : "?")}t=${Date.now()}`;
      link.href = newHref;
    }
  });
};

// node_modules/@absolutejs/absolute/dist/dev/client/domDiff.ts
var getElementKey = (elem, index2) => {
  if (elem.nodeType !== Node.ELEMENT_NODE) return `text_${index2}`;
  if (!(elem instanceof Element)) return `text_${index2}`;
  if (elem.id) return `id_${elem.id}`;
  if (elem.hasAttribute("data-key"))
    return `key_${elem.getAttribute("data-key")}`;
  return `tag_${elem.tagName}_${index2}`;
};
var updateElementAttributes = (oldEl, newEl) => {
  const newAttrs = Array.from(newEl.attributes);
  const oldAttrs = Array.from(oldEl.attributes);
  const runtimeAttrs = ["data-hmr-listeners-attached"];
  oldAttrs.forEach((oldAttr) => {
    if (
      !newEl.hasAttribute(oldAttr.name) &&
      runtimeAttrs.indexOf(oldAttr.name) === UNFOUND_INDEX
    ) {
      oldEl.removeAttribute(oldAttr.name);
    }
  });
  newAttrs.forEach((newAttr) => {
    if (
      runtimeAttrs.indexOf(newAttr.name) !== UNFOUND_INDEX &&
      oldEl.hasAttribute(newAttr.name)
    ) {
      return;
    }
    const oldValue = oldEl.getAttribute(newAttr.name);
    if (oldValue !== newAttr.value) {
      oldEl.setAttribute(newAttr.name, newAttr.value);
    }
  });
};
var updateTextNode = (oldNode, newNode) => {
  if (oldNode.nodeValue !== newNode.nodeValue) {
    oldNode.nodeValue = newNode.nodeValue;
  }
};
var matchChildren = (oldChildren, newChildren) => {
  const oldMap = new Map();
  const newMap = new Map();
  oldChildren.forEach((child2, idx) => {
    const key2 = getElementKey(child2, idx);
    if (!oldMap.has(key2)) {
      oldMap.set(key2, []);
    }
    oldMap.get(key2)?.push({ index: idx, node: child2 });
  });
  newChildren.forEach((child2, idx) => {
    const key2 = getElementKey(child2, idx);
    if (!newMap.has(key2)) {
      newMap.set(key2, []);
    }
    newMap.get(key2)?.push({ index: idx, node: child2 });
  });
  return { newMap, oldMap };
};
var isHMRScript = (elem) =>
  elem instanceof Element && elem.hasAttribute("data-hmr-client");
var isHMRPreserved = (elem) =>
  isHMRScript(elem) ||
  (elem instanceof Element && elem.hasAttribute("data-hmr-overlay"));
var isNonHMRScript = (child2) =>
  child2 instanceof Element && child2.tagName === "SCRIPT";
var findBestMatch = (oldMatches, matchedOld) => {
  const unmatched = oldMatches.find((entry) => !matchedOld.has(entry.node));
  if (unmatched) return unmatched;
  if (oldMatches.length > 0) return oldMatches[0] ?? null;
  return null;
};
var reconcileChild = (
  newChild,
  newIndex,
  oldMap,
  matchedOld,
  parentNode,
  oldChildrenFiltered,
) => {
  const newKey = getElementKey(newChild, newIndex);
  const oldMatches = oldMap.get(newKey) || [];
  if (oldMatches.length === 0) {
    const clone2 = newChild.cloneNode(true);
    parentNode.insertBefore(clone2, oldChildrenFiltered[newIndex] || null);
    return;
  }
  const bestMatch = findBestMatch(oldMatches, matchedOld);
  if (bestMatch && !matchedOld.has(bestMatch.node)) {
    matchedOld.add(bestMatch.node);
    patchNode(bestMatch.node, newChild);
    return;
  }
  const clone = newChild.cloneNode(true);
  parentNode.insertBefore(clone, oldChildrenFiltered[newIndex] || null);
};
var patchNode = (oldNode, newNode) => {
  if (
    oldNode.nodeType === Node.TEXT_NODE &&
    newNode.nodeType === Node.TEXT_NODE
  ) {
    updateTextNode(oldNode, newNode);
    return;
  }
  if (
    oldNode.nodeType !== Node.ELEMENT_NODE ||
    newNode.nodeType !== Node.ELEMENT_NODE
  ) {
    return;
  }
  if (!(oldNode instanceof Element) || !(newNode instanceof Element)) return;
  const oldEl = oldNode;
  const newEl = newNode;
  if (oldEl.tagName !== newEl.tagName) {
    const clone = newEl.cloneNode(true);
    oldEl.replaceWith(clone);
    return;
  }
  updateElementAttributes(oldEl, newEl);
  const oldChildren = Array.from(oldNode.childNodes);
  const newChildren = Array.from(newNode.childNodes);
  const oldChildrenFiltered = oldChildren.filter(
    (child2) => !isHMRScript(child2) && !isNonHMRScript(child2),
  );
  const newChildrenFiltered = newChildren.filter(
    (child2) => !isHMRScript(child2) && !isNonHMRScript(child2),
  );
  const { oldMap } = matchChildren(oldChildrenFiltered, newChildrenFiltered);
  const matchedOld = new Set();
  newChildrenFiltered.forEach((newChild, newIndex) => {
    reconcileChild(
      newChild,
      newIndex,
      oldMap,
      matchedOld,
      oldNode,
      oldChildrenFiltered,
    );
  });
  oldChildrenFiltered.forEach((oldChild) => {
    if (!matchedOld.has(oldChild) && !isHMRPreserved(oldChild)) {
      oldChild.remove();
    }
  });
};
var patchDOMInPlace = (oldContainer, newHTML) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newHTML;
  const newContainer = tempDiv;
  const oldChildren = Array.from(oldContainer.childNodes);
  const newChildren = Array.from(newContainer.childNodes);
  const oldChildrenFiltered = oldChildren.filter(
    (child2) =>
      !(
        child2 instanceof Element &&
        child2.tagName === "SCRIPT" &&
        !child2.hasAttribute("data-hmr-client")
      ),
  );
  const newChildrenFiltered = newChildren.filter(
    (child2) => !isNonHMRScript(child2),
  );
  const { oldMap } = matchChildren(oldChildrenFiltered, newChildrenFiltered);
  const matchedOld = new Set();
  newChildrenFiltered.forEach((newChild, newIndex) => {
    reconcileChild(
      newChild,
      newIndex,
      oldMap,
      matchedOld,
      oldContainer,
      oldChildrenFiltered,
    );
  });
  oldChildrenFiltered.forEach((oldChild) => {
    if (matchedOld.has(oldChild)) return;
    if (isHMRPreserved(oldChild)) return;
    oldChild.remove();
  });
};

// node_modules/@absolutejs/absolute/dist/dev/client/cssUtils.ts
var getCSSBaseName = (href) => {
  const fileName = href.split("?")[0]?.split("/").pop() || "";
  return fileName.split(".")[0] ?? "";
};
var baseNamesMatch = (baseA, baseB) =>
  baseA === baseB || baseA.includes(baseB) || baseB.includes(baseA);
var findMatchingLink = (baseNew) => {
  const links = document.head.querySelectorAll('link[rel="stylesheet"]');
  for (const existing of links) {
    if (!(existing instanceof HTMLLinkElement)) continue;
    const existingHref = existing.getAttribute("href") || "";
    const baseExisting = getCSSBaseName(existingHref);
    if (baseNamesMatch(baseExisting, baseNew)) {
      return existing;
    }
  }
  return null;
};
var createTimestampedLink = (href) => {
  const newLinkElement = document.createElement("link");
  newLinkElement.rel = "stylesheet";
  newLinkElement.media = "print";
  const newHref = `${href + (href.includes("?") ? "&" : "?")}t=${Date.now()}`;
  newLinkElement.href = newHref;
  return { newHref, newLinkElement };
};
var processNewLink = (
  newLink,
  linksToRemove,
  linksToActivate,
  linksToWaitFor,
) => {
  const href = newLink.getAttribute("href");
  if (!href) return;
  const baseNew = getCSSBaseName(href);
  const existingLink = findMatchingLink(baseNew);
  if (!existingLink) {
    const { newHref: newHref2, newLinkElement: newLinkElement2 } =
      createTimestampedLink(href);
    linksToActivate.push(newLinkElement2);
    const loadPromise2 = createCSSLoadPromise(newLinkElement2, newHref2);
    document.head.appendChild(newLinkElement2);
    linksToWaitFor.push(loadPromise2);
    return;
  }
  const existingHrefAttr = existingLink.getAttribute("href");
  const existingHref = existingHrefAttr ? existingHrefAttr.split("?")[0] : "";
  const [newHrefBase] = href.split("?");
  if (existingHref === newHrefBase) return;
  const { newHref, newLinkElement } = createTimestampedLink(href);
  linksToRemove.push(existingLink);
  linksToActivate.push(newLinkElement);
  const loadPromise = createCSSLoadPromise(newLinkElement, newHref);
  document.head.appendChild(newLinkElement);
  linksToWaitFor.push(loadPromise);
};
var processCSSLinks = (headHTML) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = headHTML;
  const newStylesheets = tempDiv.querySelectorAll('link[rel="stylesheet"]');
  const existingStylesheets = Array.from(
    document.head.querySelectorAll('link[rel="stylesheet"]'),
  );
  const newHrefs = Array.from(newStylesheets).map((link) => {
    const href = link.getAttribute("href") || "";
    return getCSSBaseName(href);
  });
  const linksToRemove = [];
  const linksToWaitFor = [];
  const linksToActivate = [];
  newStylesheets.forEach((newLink) => {
    processNewLink(newLink, linksToRemove, linksToActivate, linksToWaitFor);
  });
  existingStylesheets.forEach((existingLink) => {
    const existingHref = existingLink.getAttribute("href") || "";
    const baseExisting = getCSSBaseName(existingHref);
    const stillExists = newHrefs.some((newBase) =>
      baseNamesMatch(baseExisting, newBase),
    );
    if (stillExists) return;
    const wasHandled = Array.from(newStylesheets).some((newLink) => {
      const newHref = newLink.getAttribute("href") || "";
      const baseNewLocal = getCSSBaseName(newHref);
      return baseNamesMatch(baseExisting, baseNewLocal);
    });
    if (!wasHandled) {
      linksToRemove.push(existingLink);
    }
  });
  return { linksToActivate, linksToRemove, linksToWaitFor };
};
var findManifestHref = (manifest, baseName) => {
  const manifestKey = `${baseName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}CSS`;
  if (manifest[manifestKey]) {
    return manifest[manifestKey];
  }
  for (const [key2, value] of Object.entries(manifest)) {
    if (key2.endsWith("CSS") && value.includes(baseName)) {
      return value;
    }
  }
  return null;
};
var updateStylesheetLink = (link, manifest) => {
  if (!(link instanceof HTMLLinkElement)) return;
  const href = link.getAttribute("href");
  if (!href || href.includes("htmx.min.js")) return;
  let newHref = null;
  if (manifest) {
    const baseName = getCSSBaseName(href);
    newHref = findManifestHref(manifest, baseName);
  }
  if (newHref && newHref !== href) {
    link.href = `${newHref}?t=${Date.now()}`;
  } else {
    const url = new URL(href, window.location.origin);
    url.searchParams.set("t", Date.now().toString());
    link.href = url.toString();
  }
};
var reloadCSSStylesheets = (manifest) => {
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach((link) => {
    updateStylesheetLink(link, manifest);
  });
};
var createCSSLoadPromise = (linkElement, newHref) =>
  new Promise((resolve) => {
    let resolved = false;
    const doResolve = function () {
      if (resolved) return;
      resolved = true;
      resolve();
    };
    const verifyCSSOM = function () {
      try {
        const sheets = Array.from(document.styleSheets);
        return sheets.some(
          (sheet) =>
            sheet.href && sheet.href.includes(newHref.split("?")[0] ?? ""),
        );
      } catch {
        return false;
      }
    };
    linkElement.onload = function () {
      let checkCount = 0;
      const checkCSSOM = function () {
        checkCount++;
        if (verifyCSSOM() || checkCount > CSS_MAX_CHECK_ATTEMPTS) {
          doResolve();
        } else {
          requestAnimationFrame(checkCSSOM);
        }
      };
      requestAnimationFrame(checkCSSOM);
    };
    linkElement.onerror = function () {
      setTimeout(() => {
        doResolve();
      }, CSS_ERROR_RESOLVE_DELAY_MS);
    };
    setTimeout(() => {
      if (linkElement.sheet && !resolved) {
        doResolve();
      }
    }, CSS_SHEET_READY_TIMEOUT_MS);
    setTimeout(() => {
      if (!resolved) {
        doResolve();
      }
    }, CSS_MAX_PARSE_TIMEOUT_MS);
  });
var removeLinks = (linksToRemove) => {
  linksToRemove.forEach((link) => {
    if (link.parentNode) {
      link.remove();
    }
  });
};
var activateLinks = (linksToActivate) => {
  linksToActivate.forEach((link) => {
    link.media = "all";
  });
};
var chainRAF = (depth, callback) => {
  if (depth <= 0) {
    callback();
    return;
  }
  requestAnimationFrame(() => {
    chainRAF(depth - 1, callback);
  });
};
var waitForCSSAndUpdate = (cssResult, updateBody) => {
  const { linksToActivate, linksToRemove, linksToWaitFor } = cssResult;
  if (linksToWaitFor.length > 0) {
    Promise.all(linksToWaitFor).then(() => {
      setTimeout(() => {
        chainRAF(RAF_BATCH_COUNT, () => {
          updateBody();
          activateLinks(linksToActivate);
          requestAnimationFrame(() => {
            removeLinks(linksToRemove);
            if (hmrState.isFirstHMRUpdate) {
              hmrState.isFirstHMRUpdate = false;
            }
          });
        });
      }, DOM_UPDATE_DELAY_MS);
      return;
    });
    return;
  }
  const doUpdate = function () {
    chainRAF(RAF_BATCH_COUNT, () => {
      updateBody();
      requestAnimationFrame(() => {
        removeLinks(linksToRemove);
      });
    });
  };
  if (hmrState.isFirstHMRUpdate) {
    hmrState.isFirstHMRUpdate = false;
    setTimeout(doUpdate, DOM_UPDATE_DELAY_MS);
  } else {
    doUpdate();
  }
};

// node_modules/@absolutejs/absolute/dist/dev/client/headPatch.ts
var getLinkElementKey = (elem) => {
  const rel = (elem.getAttribute("rel") || "").toLowerCase();
  if (rel === "icon" || rel === "shortcut icon" || rel === "apple-touch-icon")
    return `link:icon:${rel}`;
  if (rel === "stylesheet") return null;
  if (rel === "preconnect")
    return `link:preconnect:${elem.getAttribute("href") || ""}`;
  if (rel === "preload")
    return `link:preload:${elem.getAttribute("href") || ""}`;
  if (rel === "canonical") return "link:canonical";
  if (rel === "dns-prefetch")
    return `link:dns-prefetch:${elem.getAttribute("href") || ""}`;
  return null;
};
var getHeadElementKey = (elem) => {
  const tag2 = elem.tagName.toLowerCase();
  if (tag2 === "title") return "title";
  if (tag2 === "meta" && elem.hasAttribute("charset")) return "meta:charset";
  if (tag2 === "meta" && elem.hasAttribute("name"))
    return `meta:name:${elem.getAttribute("name")}`;
  if (tag2 === "meta" && elem.hasAttribute("property"))
    return `meta:property:${elem.getAttribute("property")}`;
  if (tag2 === "meta" && elem.hasAttribute("http-equiv"))
    return `meta:http-equiv:${elem.getAttribute("http-equiv")}`;
  if (tag2 === "link") return getLinkElementKey(elem);
  if (tag2 === "script" && elem.hasAttribute("data-hmr-id"))
    return `script:hmr:${elem.getAttribute("data-hmr-id")}`;
  if (tag2 === "script") return null;
  if (tag2 === "base") return "base";
  return null;
};
var shouldPreserveElement = (elem) => {
  if (elem.hasAttribute("data-hmr-import-map")) return true;
  if (elem.hasAttribute("data-hmr-client")) return true;
  if (elem.hasAttribute("data-react-refresh-setup")) return true;
  const attrs = Array.from(elem.attributes);
  for (let idx = 0; idx < attrs.length; idx++) {
    if (attrs[idx]?.name.startsWith("data-hmr-")) return true;
  }
  if (elem.tagName === "SCRIPT") {
    const src = elem.getAttribute("src") || "";
    if (src.includes("htmx.min.js") || src.includes("htmx.js")) return true;
  }
  return false;
};
var updateTitleElement = (oldEl, newEl) => {
  const newTitle = newEl.textContent || "";
  if (oldEl.textContent === newTitle) return;
  oldEl.textContent = newTitle;
  document.title = newTitle;
};
var updateMetaElement = (oldEl, newEl) => {
  const newContent = newEl.getAttribute("content");
  const oldContent = oldEl.getAttribute("content");
  if (oldContent !== newContent && newContent !== null) {
    oldEl.setAttribute("content", newContent);
  }
  if (!newEl.hasAttribute("charset")) return;
  const newCharset = newEl.getAttribute("charset");
  if (oldEl.getAttribute("charset") !== newCharset && newCharset !== null) {
    oldEl.setAttribute("charset", newCharset);
  }
};
var updateFaviconHref = (oldEl, newHref, oldHref) => {
  const [oldBase] = oldHref.split("?");
  const [newBase] = newHref.split("?");
  if (oldBase === newBase) return;
  const cacheBustedHref = `${newHref + (newHref.includes("?") ? "&" : "?")}t=${Date.now()}`;
  oldEl.setAttribute("href", cacheBustedHref);
};
var updateLinkElement = (oldEl, newEl) => {
  const rel = (oldEl.getAttribute("rel") || "").toLowerCase();
  const newHref = newEl.getAttribute("href");
  const oldHref = oldEl.getAttribute("href");
  const isIcon =
    rel === "icon" || rel === "shortcut icon" || rel === "apple-touch-icon";
  if (isIcon && newHref && oldHref) {
    updateFaviconHref(oldEl, newHref, oldHref);
  } else if (!isIcon && newHref && oldHref !== newHref) {
    oldEl.setAttribute("href", newHref);
  }
  const attrsToCheck = ["type", "sizes", "crossorigin", "as", "media"];
  attrsToCheck.forEach((attr2) => {
    const newVal = newEl.getAttribute(attr2);
    const oldVal = oldEl.getAttribute(attr2);
    if (newVal !== null && oldVal !== newVal) {
      oldEl.setAttribute(attr2, newVal);
    } else if (newVal === null && oldVal !== null) {
      oldEl.removeAttribute(attr2);
    }
  });
};
var updateBaseElement = (oldEl, newEl) => {
  const newHref = newEl.getAttribute("href");
  const newTarget = newEl.getAttribute("target");
  if (newHref && oldEl.getAttribute("href") !== newHref) {
    oldEl.setAttribute("href", newHref);
  }
  if (newTarget && oldEl.getAttribute("target") !== newTarget) {
    oldEl.setAttribute("target", newTarget);
  }
};
var updateHeadElement = (oldEl, newEl) => {
  const tag2 = oldEl.tagName.toLowerCase();
  if (tag2 === "title") {
    updateTitleElement(oldEl, newEl);
    return;
  }
  if (tag2 === "meta") {
    updateMetaElement(oldEl, newEl);
    return;
  }
  if (tag2 === "link") {
    updateLinkElement(oldEl, newEl);
    return;
  }
  if (tag2 === "base") {
    updateBaseElement(oldEl, newEl);
  }
};
var addHeadElement = (newEl) => {
  const clone = document.createElement(newEl.tagName.toLowerCase());
  for (const attr2 of Array.from(newEl.attributes)) {
    clone.setAttribute(attr2.name, attr2.value);
  }
  clone.textContent = newEl.textContent;
  clone.setAttribute("data-hmr-source", "patched");
  const tag2 = newEl.tagName.toLowerCase();
  const { head: head2 } = document;
  let insertBefore = null;
  if (tag2 === "title") {
    insertBefore = head2.firstChild;
  } else if (tag2 === "meta") {
    const firstLink = head2.querySelector("link");
    const firstScript = head2.querySelector("script");
    insertBefore = firstLink || firstScript;
  } else if (tag2 === "link") {
    const firstScript = head2.querySelector("script");
    insertBefore = firstScript;
  }
  if (insertBefore) {
    head2.insertBefore(clone, insertBefore);
  } else {
    head2.appendChild(clone);
  }
};
var removeStaleElement = (existingEl) => {
  if (shouldPreserveElement(existingEl)) return;
  const tag2 = existingEl.tagName.toLowerCase();
  const rel = existingEl.getAttribute("rel") || "";
  if (tag2 === "link" && rel === "stylesheet") return;
  existingEl.remove();
};
var patchHeadInPlace = (newHeadHTML) => {
  if (!newHeadHTML) return;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newHeadHTML;
  const existingMap = new Map();
  const newMap = new Map();
  Array.from(document.head.children).forEach((elem) => {
    if (shouldPreserveElement(elem)) return;
    const key2 = getHeadElementKey(elem);
    if (key2) {
      existingMap.set(key2, elem);
    }
  });
  Array.from(tempDiv.children).forEach((elem) => {
    const key2 = getHeadElementKey(elem);
    if (key2) {
      newMap.set(key2, elem);
    }
  });
  newMap.forEach((newEl, key2) => {
    const existingEl = existingMap.get(key2);
    if (existingEl) {
      updateHeadElement(existingEl, newEl);
    } else {
      addHeadElement(newEl);
    }
  });
  existingMap.forEach((existingEl, key2) => {
    if (!newMap.has(key2)) {
      removeStaleElement(existingEl);
    }
  });
};

// node_modules/@absolutejs/absolute/dist/dev/client/domTracker.ts
var restoreDOMChanges = (root2, snapshot2, newHTML) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newHTML;
  snapshot2.text.forEach((liveText, elId) => {
    const newEl = tempDiv.querySelector(`#${CSS.escape(elId)}`);
    const newText = newEl ? newEl.textContent || "" : "";
    if (liveText === newText) return;
    const liveEl = root2.querySelector(`#${CSS.escape(elId)}`);
    if (liveEl) {
      liveEl.textContent = liveText;
    }
  });
  snapshot2.children.forEach((liveHTML, elId) => {
    const newEl = tempDiv.querySelector(`#${CSS.escape(elId)}`);
    const newInner = newEl ? newEl.innerHTML : "";
    if (liveHTML === newInner || liveHTML.length <= newInner.length) return;
    const liveEl = root2.querySelector(`#${CSS.escape(elId)}`);
    if (liveEl) {
      liveEl.innerHTML = liveHTML;
    }
  });
};
var snapshotDOMChanges = (root2) => {
  const text2 = new Map();
  const children = new Map();
  root2.querySelectorAll("[id]").forEach((elem) => {
    const { childNodes } = elem;
    const isTextLeaf = Array.from(childNodes).every(
      (child2) => child2.nodeType === Node.TEXT_NODE,
    );
    if (isTextLeaf && childNodes.length > 0) {
      text2.set(elem.id, elem.textContent || "");
    } else if (elem.children.length > 0) {
      children.set(elem.id, elem.innerHTML);
    }
  });
  return { children, text: text2 };
};

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/html.ts
var parseHTMLMessage = (html2) => {
  let body = null;
  let head2 = null;
  if (typeof html2 === "string") {
    body = html2;
  } else if (html2 && typeof html2 === "object") {
    body = html2.body || null;
    head2 = html2.head || null;
  }
  return { body, head: head2 };
};
var applyHeadPatch = (htmlHead) => {
  if (!htmlHead) {
    return;
  }
  const doPatchHead = () => {
    patchHeadInPlace(htmlHead);
  };
  if (hmrState.isFirstHMRUpdate) {
    setTimeout(doPatchHead, DOM_UPDATE_DELAY_MS);
  } else {
    doPatchHead();
  }
};
var handleHTMLBodyWithHead = (htmlBody, htmlHead, htmlDomState) => {
  applyHeadPatch(htmlHead);
  const cssResult = processCSSLinks(htmlHead);
  const updateBodyAfterCSS = () => {
    updateHTMLBody(htmlBody, htmlDomState, document.body);
  };
  waitForCSSAndUpdate(cssResult, updateBodyAfterCSS);
};
var handleHTMLBodyWithoutHead = (htmlBody, htmlDomState) => {
  const container = document.body;
  if (!container) {
    sessionStorage.removeItem("__HMR_ACTIVE__");
    return;
  }
  updateHTMLBodyDirect(htmlBody, htmlDomState, container);
  restoreDOMState(container, htmlDomState);
};
var handleHTMLUpdate = (message) => {
  const htmlFrameworkCheck = detectCurrentFramework();
  if (htmlFrameworkCheck !== "html") {
    return;
  }
  if (window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = undefined;
  }
  sessionStorage.setItem("__HMR_ACTIVE__", "true");
  const htmlDomState = saveDOMState(document.body);
  const { body: htmlBody, head: htmlHead } = parseHTMLMessage(
    message.data.html,
  );
  if (!htmlBody) {
    sessionStorage.removeItem("__HMR_ACTIVE__");
    return;
  }
  if (htmlHead) {
    handleHTMLBodyWithHead(htmlBody, htmlHead, htmlDomState);
  } else {
    handleHTMLBodyWithoutHead(htmlBody, htmlDomState);
  }
};
var handleScriptUpdate = (message) => {
  const scriptFramework = message.data.framework;
  const currentFw = detectCurrentFramework();
  if (currentFw !== scriptFramework) {
    return;
  }
  const { scriptPath } = message.data;
  if (!scriptPath) {
    console.warn("[HMR] No script path in update");
    return;
  }
  const interactiveSelectors =
    "button, [onclick], [onchange], [oninput], details, input, select, textarea";
  document.body.querySelectorAll(interactiveSelectors).forEach((elem) => {
    const cloned = elem.cloneNode(true);
    if (elem.parentNode) {
      elem.parentNode.replaceChild(cloned, elem);
    }
  });
  const cacheBustedPath = `${scriptPath}?t=${Date.now()}`;
  import(cacheBustedPath)
    .then(() => true)
    .catch((err) => {
      console.error(
        "[HMR] Script hot-reload failed, falling back to page reload:",
        err,
      );
      window.location.reload();
    });
};
var saveHTMLState = () => ({
  forms: saveFormState(),
  scroll: saveScrollState(),
});
var preserveHmrScript = (container, hmrScript) => {
  if (hmrScript && !container.querySelector("script[data-hmr-client]")) {
    container.appendChild(hmrScript);
  }
};
var updateHTMLBody = (htmlBody, htmlDomState, container) => {
  if (!container) {
    return;
  }
  const savedState = saveHTMLState();
  const domSnapshot = snapshotDOMChanges(container);
  const existingScripts = collectScripts(container);
  const hmrScript = container.querySelector("script[data-hmr-client]");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlBody;
  const newScripts = collectScriptsFromElement(tempDiv);
  const htmlStructureChanged = didHTMLStructureChange(container, tempDiv);
  if (htmlStructureChanged || didScriptsChange(existingScripts, newScripts)) {
    patchDOMInPlace(container, htmlBody);
    restoreDOMChanges(container, domSnapshot, htmlBody);
  }
  preserveHmrScript(container, hmrScript);
  requestAnimationFrame(() => {
    restoreDOMState(container, htmlDomState);
    restoreFormState(savedState.forms);
    restoreScrollState(savedState.scroll);
    if (didScriptsChange(existingScripts, newScripts) || htmlStructureChanged) {
      cloneInteractiveElements(container);
      reExecuteScripts(container, newScripts);
    }
  });
  sessionStorage.removeItem("__HMR_ACTIVE__");
};
var cloneHmrListenerElements = (container) => {
  container
    .querySelectorAll("[data-hmr-listeners-attached]")
    .forEach((elem) => {
      const cloned = elem.cloneNode(true);
      if (elem.parentNode) {
        elem.parentNode.replaceChild(cloned, elem);
      }
      if (cloned instanceof Element) {
        cloned.removeAttribute("data-hmr-listeners-attached");
      }
    });
};
var replaceInlineScript = (script) => {
  if (script.hasAttribute("data-hmr-client")) {
    return;
  }
  const newScript = document.createElement("script");
  newScript.textContent = script.textContent || "";
  const scriptEl = script instanceof HTMLScriptElement ? script : null;
  newScript.type = scriptEl?.type || "text/javascript";
  if (script.parentNode) {
    script.parentNode.replaceChild(newScript, script);
  }
};
var updateHTMLBodyDirect = (htmlBody, htmlDomState, container) => {
  const savedState = saveHTMLState();
  const domSnapshot = snapshotDOMChanges(container);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlBody;
  const newScripts = collectScriptsFromElement(tempDiv);
  const hmrScript = container.querySelector("script[data-hmr-client]");
  patchDOMInPlace(container, htmlBody);
  restoreDOMChanges(container, domSnapshot, htmlBody);
  preserveHmrScript(container, hmrScript);
  requestAnimationFrame(() => {
    restoreDOMState(container, htmlDomState);
    restoreFormState(savedState.forms);
    restoreScrollState(savedState.scroll);
    cloneHmrListenerElements(container);
    removeOldScripts(container);
    newScripts.forEach((scriptInfo) => {
      const newScript = document.createElement("script");
      const separator = scriptInfo.src.includes("?") ? "&" : "?";
      newScript.src = `${scriptInfo.src + separator}t=${Date.now()}`;
      newScript.type = scriptInfo.type;
      container.appendChild(newScript);
    });
    const inlineScripts = container.querySelectorAll("script:not([src])");
    inlineScripts.forEach(replaceInlineScript);
  });
  sessionStorage.removeItem("__HMR_ACTIVE__");
};
var collectScripts = (container) =>
  Array.from(container.querySelectorAll("script[src]")).map((script) => ({
    src: script.getAttribute("src") || "",
    type: script.getAttribute("type") || "text/javascript",
  }));
var collectScriptsFromElement = (elem) =>
  Array.from(elem.querySelectorAll("script[src]")).map((script) => ({
    src: script.getAttribute("src") || "",
    type: script.getAttribute("type") || "text/javascript",
  }));
var didScriptsChange = (oldScripts, newScripts) =>
  oldScripts.length !== newScripts.length ||
  oldScripts.some((oldScript, idx) => {
    const [oldSrcBase] = oldScript.src.split("?")[0]?.split("&") ?? [""];
    const newScript = newScripts[idx];
    if (!newScript) return true;
    const [newSrcBase] = newScript.src.split("?")[0]?.split("&") ?? [""];
    return oldSrcBase !== newSrcBase;
  });
var normalizeHTMLForComparison = (element2) => {
  const clonedNode = element2.cloneNode(true);
  if (!(clonedNode instanceof HTMLElement)) return "";
  const clone = clonedNode;
  const scripts = clone.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  });
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((elem) => {
    elem.removeAttribute("data-hmr-listeners-attached");
  });
  if (clone.removeAttribute) {
    clone.removeAttribute("data-hmr-listeners-attached");
  }
  return clone.innerHTML;
};
var didHTMLStructureChange = (container, tempDiv) =>
  normalizeHTMLForComparison(container) !== normalizeHTMLForComparison(tempDiv);
var cloneInteractiveElements = (container) => {
  const interactiveSelectors =
    'button, [onclick], [onchange], [oninput], [onsubmit], details, input[type="button"], input[type="submit"], input[type="reset"]';
  container.querySelectorAll(interactiveSelectors).forEach((elem) => {
    const cloned = elem.cloneNode(true);
    if (elem.parentNode) {
      elem.parentNode.replaceChild(cloned, elem);
    }
  });
};
var removeOldScripts = (container) => {
  const scriptsInNewHTML = container.querySelectorAll("script[src]");
  scriptsInNewHTML.forEach((script) => {
    if (!script.hasAttribute("data-hmr-client")) {
      script.remove();
    }
  });
};
var reExecuteScripts = (container, newScripts) => {
  removeOldScripts(container);
  newScripts.forEach((scriptInfo) => {
    const newScript = document.createElement("script");
    const separator = scriptInfo.src.includes("?") ? "&" : "?";
    newScript.src = `${scriptInfo.src + separator}t=${Date.now()}`;
    newScript.type = scriptInfo.type;
    container.appendChild(newScript);
  });
  const inlineScripts = container.querySelectorAll("script:not([src])");
  inlineScripts.forEach(replaceInlineScript);
};

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/htmx.ts
var parseHTMXMessage = (html2) => {
  let body = null;
  let head2 = null;
  if (typeof html2 === "string") {
    body = html2;
  } else if (html2 && typeof html2 === "object") {
    body = html2.body || null;
    head2 = html2.head || null;
  }
  return { body, head: head2 };
};
var applyHeadPatch2 = (htmxHead) => {
  if (!htmxHead) {
    return;
  }
  const doPatchHead = () => {
    patchHeadInPlace(htmxHead);
  };
  if (hmrState.isFirstHMRUpdate) {
    setTimeout(doPatchHead, DOM_UPDATE_DELAY_MS);
  } else {
    doPatchHead();
  }
};
var handleHTMXBodyUpdate = (htmxBody, htmxHead, htmxDomState) => {
  const updateHTMXBodyAfterCSS = () => {
    updateHTMXBody(htmxBody, htmxDomState, document.body);
  };
  if (htmxHead) {
    applyHeadPatch2(htmxHead);
    const cssResult = processCSSLinks(htmxHead);
    waitForCSSAndUpdate(cssResult, updateHTMXBodyAfterCSS);
  } else {
    updateHTMXBodyAfterCSS();
  }
};
var handleHTMXUpdate = (message) => {
  const htmxFrameworkCheck = detectCurrentFramework();
  if (htmxFrameworkCheck !== "htmx") return;
  if (window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = undefined;
  }
  sessionStorage.setItem("__HMR_ACTIVE__", "true");
  const htmxDomState = saveDOMState(document.body);
  const { body: htmxBody, head: htmxHead } = parseHTMXMessage(
    message.data.html,
  );
  if (!htmxBody) {
    sessionStorage.removeItem("__HMR_ACTIVE__");
    return;
  }
  handleHTMXBodyUpdate(htmxBody, htmxHead, htmxDomState);
};
var cloneHmrListenerElements2 = (container) => {
  container
    .querySelectorAll("[data-hmr-listeners-attached]")
    .forEach((elem) => {
      const cloned = elem.cloneNode(true);
      if (elem.parentNode) {
        elem.parentNode.replaceChild(cloned, elem);
      }
      cloned.removeAttribute("data-hmr-listeners-attached");
    });
};
var removeOldScripts2 = (container) => {
  const scriptsInNewHTML = container.querySelectorAll("script[src]");
  scriptsInNewHTML.forEach((script) => {
    if (!script.hasAttribute("data-hmr-client")) {
      script.remove();
    }
  });
};
var addNewScripts = (container, newScripts) => {
  newScripts.forEach((scriptInfo) => {
    const newScript = document.createElement("script");
    const separator = scriptInfo.src.includes("?") ? "&" : "?";
    newScript.src = `${scriptInfo.src + separator}t=${Date.now()}`;
    newScript.type = scriptInfo.type;
    container.appendChild(newScript);
  });
};
var replaceInlineScript2 = (script) => {
  if (script.hasAttribute("data-hmr-client")) {
    return;
  }
  const newScript = document.createElement("script");
  newScript.textContent = script.textContent || "";
  newScript.type = script.getAttribute("type") || "text/javascript";
  if (script.parentNode) {
    script.parentNode.replaceChild(newScript, script);
  }
};
var reExecuteScripts2 = (container, newScripts) => {
  removeOldScripts2(container);
  addNewScripts(container, newScripts);
  const inlineScripts = container.querySelectorAll("script:not([src])");
  inlineScripts.forEach(replaceInlineScript2);
};
var handleScriptsAndStructureChange = (container, newScripts) => {
  cloneHmrListenerElements2(container);
  reExecuteScripts2(container, newScripts);
};
var restoreCounterSpan = (container, count) => {
  const newCountSpan = container.querySelector("#count");
  if (newCountSpan && count !== undefined) {
    newCountSpan.textContent = String(count);
  }
};
var updateHTMXBody = (htmxBody, htmxDomState, container) => {
  if (!container) return;
  const countSpan = container.querySelector("#count");
  const countValue = countSpan ? parseInt(countSpan.textContent || "0", 10) : 0;
  const savedState = {
    componentState: { count: countValue },
    forms: saveFormState(),
    scroll: saveScrollState(),
  };
  const existingScripts = collectScripts2(container);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmxBody;
  if (savedState.componentState.count !== undefined) {
    restoreCounterSpan(tempDiv, savedState.componentState.count);
  }
  const patchedBody = tempDiv.innerHTML;
  const newScripts = collectScriptsFromElement2(tempDiv);
  const scriptsChanged = didScriptsChange2(existingScripts, newScripts);
  const htmlStructureChanged = didHTMLStructureChange2(container, tempDiv);
  const hmrScript = container.querySelector("script[data-hmr-client]");
  patchDOMInPlace(container, patchedBody);
  if (hmrScript && !container.querySelector("script[data-hmr-client]")) {
    container.appendChild(hmrScript);
  }
  requestAnimationFrame(() => {
    restoreFormState(savedState.forms);
    restoreScrollState(savedState.scroll);
    restoreCounterSpan(container, savedState.componentState.count);
    restoreDOMState(container, htmxDomState);
    if (scriptsChanged || htmlStructureChanged) {
      handleScriptsAndStructureChange(container, newScripts);
    }
    if (window.htmx) {
      window.htmx.process(container);
    }
  });
  sessionStorage.removeItem("__HMR_ACTIVE__");
};
var collectScripts2 = (container) =>
  Array.from(container.querySelectorAll("script[src]")).map((script) => ({
    src: script.getAttribute("src") || "",
    type: script.getAttribute("type") || "text/javascript",
  }));
var collectScriptsFromElement2 = (elem) =>
  Array.from(elem.querySelectorAll("script[src]")).map((script) => ({
    src: script.getAttribute("src") || "",
    type: script.getAttribute("type") || "text/javascript",
  }));
var didScriptsChange2 = (oldScripts, newScripts) =>
  oldScripts.length !== newScripts.length ||
  oldScripts.some((oldScript, idx) => {
    const [oldBeforeQuery = ""] = oldScript.src.split("?");
    const [oldSrcBase] = oldBeforeQuery.split("&");
    const newScript = newScripts[idx];
    if (!newScript) return true;
    const [newBeforeQuery = ""] = newScript.src.split("?");
    const [newSrcBase] = newBeforeQuery.split("&");
    return oldSrcBase !== newSrcBase;
  });
var normalizeHTMLForComparison2 = (element2) => {
  const clone = element2.cloneNode(true);
  const scripts = clone.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  });
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((elem) => {
    elem.removeAttribute("data-hmr-listeners-attached");
  });
  if (clone.removeAttribute) {
    clone.removeAttribute("data-hmr-listeners-attached");
  }
  return clone.innerHTML;
};
var didHTMLStructureChange2 = (container, tempDiv) =>
  normalizeHTMLForComparison2(container) !==
  normalizeHTMLForComparison2(tempDiv);

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/svelte.ts
var swapStylesheet2 = (cssUrl, cssBaseName, framework) => {
  let existingLink = null;
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    if (href.includes(cssBaseName) || href.includes(framework)) {
      existingLink = link;
    }
  });
  if (!existingLink) {
    return;
  }
  const capturedExisting = existingLink;
  const newLink = document.createElement("link");
  newLink.rel = "stylesheet";
  newLink.href = `${cssUrl}?t=${Date.now()}`;
  newLink.onload = () => {
    if (capturedExisting && capturedExisting.parentNode) {
      capturedExisting.remove();
    }
  };
  document.head.appendChild(newLink);
};
var extractCountFromDOM = () => {
  const countButton = document.querySelector("button");
  if (!countButton || !countButton.textContent) {
    return {};
  }
  const countMatch = countButton.textContent.match(/(\d+)/);
  if (!countMatch) {
    return {};
  }
  return { initialCount: parseInt(countMatch[1] ?? "0", 10) };
};
var loadStateFromSession = () => {
  try {
    const stored = sessionStorage.getItem("__SVELTE_HMR_STATE__");
    if (!stored) {
      return {};
    }
    const parsed = JSON.parse(stored);
    if (parsed && Object.keys(parsed).length > 0) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
};
var saveStateToSession = (preservedState) => {
  if (Object.keys(preservedState).length === 0) {
    return;
  }
  try {
    sessionStorage.setItem(
      "__SVELTE_HMR_STATE__",
      JSON.stringify(preservedState),
    );
  } catch {}
};
var collectCssRules = (sheet) => {
  let rules = "";
  for (let idx = 0; idx < sheet.cssRules.length; idx++) {
    const rule = sheet.cssRules[idx];
    if (!rule) continue;
    rules += `${rule.cssText}
`;
  }
  return rules;
};
var preserveLinkAsInlineStyle = (link) => {
  try {
    const { sheet } = link;
    if (!sheet || sheet.cssRules.length === 0) {
      return null;
    }
    const style = document.createElement("style");
    style.dataset.hmrPreserved = "true";
    style.textContent = collectCssRules(sheet);
    document.head.appendChild(style);
    return style;
  } catch {
    const clone = document.createElement("link");
    clone.rel = link.rel;
    clone.href = link.href;
    clone.dataset.hmrPreserved = "true";
    document.head.appendChild(clone);
    return null;
  }
};
var preserveAllStylesheets = () => {
  const preservedStyles = [];
  document.querySelectorAll('head link[rel="stylesheet"]').forEach((link) => {
    const style = preserveLinkAsInlineStyle(link);
    if (style) {
      preservedStyles.push(style);
    }
  });
  document
    .querySelectorAll("head style:not([data-hmr-preserved])")
    .forEach((style) => {
      const clone = document.createElement("style");
      clone.dataset.hmrPreserved = "true";
      clone.textContent = style.textContent;
      document.head.appendChild(clone);
    });
  return preservedStyles;
};
var buildLinkLoadPromise = (link) => {
  if (link.sheet && link.sheet.cssRules.length > 0) {
    return null;
  }
  return new Promise((resolve) => {
    link.onload = () => {
      resolve();
    };
    link.onerror = () => {
      resolve();
    };
    setTimeout(resolve, SVELTE_CSS_LOAD_TIMEOUT_MS);
  });
};
var cleanupAfterImport = (domState, scrollState) => {
  document
    .querySelectorAll('[data-hmr-preserved="true"]')
    .forEach((element2) => {
      element2.remove();
    });
  restoreDOMState(document.body, domState);
  restoreScrollState(scrollState);
};
var waitForStylesAndCleanup = (domState, scrollState) => {
  const newLinks = document.querySelectorAll(
    'head link[rel="stylesheet"]:not([data-hmr-preserved])',
  );
  const loadPromises = [];
  newLinks.forEach((link) => {
    const promise = buildLinkLoadPromise(link);
    if (promise) {
      loadPromises.push(promise);
    }
  });
  const cleanup = () => {
    cleanupAfterImport(domState, scrollState);
  };
  if (loadPromises.length > 0) {
    Promise.all(loadPromises).then(cleanup);
  } else {
    cleanup();
  }
};
var handleSvelteUpdate = (message) => {
  const svelteFrameworkCheck = detectCurrentFramework();
  if (svelteFrameworkCheck !== "svelte") return;
  if (message.data.updateType === "css-only" && message.data.cssUrl) {
    swapStylesheet2(
      message.data.cssUrl,
      message.data.cssBaseName || "",
      "svelte",
    );
    return;
  }
  const domState = saveDOMState(document.body);
  const scrollState = saveScrollState();
  let preservedState = extractCountFromDOM();
  if (Object.keys(preservedState).length === 0) {
    preservedState = loadStateFromSession();
  }
  window.__HMR_PRESERVED_STATE__ = preservedState;
  saveStateToSession(preservedState);
  const indexPath = findIndexPath(
    message.data.manifest,
    message.data.sourceFile,
    "svelte",
  );
  if (!indexPath) {
    console.warn("[HMR] Svelte index path not found, reloading");
    window.location.reload();
    return;
  }
  if (message.data.cssUrl) {
    swapStylesheet2(
      message.data.cssUrl,
      message.data.cssBaseName || "",
      "svelte",
    );
  }
  preserveAllStylesheets();
  const modulePath = `${indexPath}?t=${Date.now()}`;
  import(modulePath)
    .then(() => {
      waitForStylesAndCleanup(domState, scrollState);
      return;
    })
    .catch((err) => {
      console.warn("[HMR] Svelte import failed, reloading:", err);
      window.location.reload();
    });
};

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/vue.ts
var collectSetupValue = (target, key2, value) => {
  if (value && typeof value === "object" && "value" in value) {
    target[key2] = value.value;
    return;
  }
  if (typeof value !== "function") {
    target[key2] = value;
  }
};
var collectSetupState = (target, setupState) => {
  const keys = Object.keys(setupState);
  for (let idx = 0; idx < keys.length; idx++) {
    const key2 = keys[idx];
    if (key2 === undefined) continue;
    collectSetupValue(target, key2, setupState[key2]);
  }
};
var walkVNode = (vnode, state2) => {
  if (!vnode) return;
  if (vnode.component && vnode.component.setupState) {
    collectSetupState(state2, vnode.component.setupState);
  }
  if (vnode.children && Array.isArray(vnode.children)) {
    vnode.children.forEach((child2) => {
      walkVNode(child2, state2);
    });
  }
  if (vnode.component && vnode.component.subTree) {
    walkVNode(vnode.component.subTree, state2);
  }
};
var extractChildComponentState = (instance, state2) => {
  if (!instance || !instance.subTree) return;
  walkVNode(instance.subTree, state2);
};
var findMatchingStylesheetLink = (cssBaseName) => {
  let found = null;
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    if (cssBaseName && href.includes(cssBaseName)) {
      found = link;
    }
  });
  return found;
};
var swapStylesheet3 = (cssUrl, cssBaseName) => {
  const existingLink = findMatchingStylesheetLink(cssBaseName);
  if (!existingLink) return;
  const capturedExisting = existingLink;
  const newLink = document.createElement("link");
  newLink.rel = "stylesheet";
  newLink.href = `${cssUrl}?t=${Date.now()}`;
  newLink.onload = function () {
    if (capturedExisting && capturedExisting.parentNode) {
      capturedExisting.remove();
    }
  };
  document.head.appendChild(newLink);
};
var extractVueAppState = (vuePreservedState) => {
  if (!window.__VUE_APP__ || !window.__VUE_APP__._instance) return;
  const instance = window.__VUE_APP__._instance;
  if (instance.setupState) {
    collectSetupState(vuePreservedState, instance.setupState);
  }
  extractChildComponentState(instance, vuePreservedState);
};
var extractCountFromDOM2 = (vuePreservedState) => {
  if (Object.keys(vuePreservedState).length > 0) return;
  const countButton = document.querySelector("button");
  if (!countButton || !countButton.textContent) return;
  const countMatch = countButton.textContent.match(/count is (\d+)/i);
  if (!countMatch) return;
  vuePreservedState.initialCount = parseInt(countMatch[1] ?? "0", 10);
};
var handleVueImportSuccess = (vueRoot, vueDomState) => {
  if (vueRoot && vueDomState) {
    restoreDOMState(vueRoot, vueDomState);
  }
  sessionStorage.removeItem("__HMR_ACTIVE__");
};
var handleVueUpdate = (message) => {
  const vueFrameworkCheck = detectCurrentFramework();
  if (vueFrameworkCheck !== "vue") return;
  if (message.data.updateType === "css-only" && message.data.cssUrl) {
    swapStylesheet3(message.data.cssUrl, message.data.cssBaseName || "");
    return;
  }
  sessionStorage.setItem("__HMR_ACTIVE__", "true");
  const vueRoot = document.getElementById("root");
  const vueDomState = vueRoot ? saveDOMState(vueRoot) : null;
  const vuePreservedState = {};
  extractVueAppState(vuePreservedState);
  extractCountFromDOM2(vuePreservedState);
  if (
    vuePreservedState.count !== undefined &&
    vuePreservedState.initialCount === undefined
  ) {
    vuePreservedState.initialCount = vuePreservedState.count;
  }
  try {
    sessionStorage.setItem(
      "__VUE_HMR_STATE__",
      JSON.stringify(vuePreservedState),
    );
  } catch {}
  window.__HMR_PRESERVED_STATE__ = vuePreservedState;
  if (message.data.cssUrl) {
    swapStylesheet3(message.data.cssUrl, message.data.cssBaseName || "");
  }
  const savedHTML = vueRoot ? vueRoot.innerHTML : "";
  if (window.__VUE_APP__) {
    window.__VUE_APP__.unmount();
    window.__VUE_APP__ = null;
  }
  if (vueRoot) {
    vueRoot.innerHTML = savedHTML;
  }
  const indexPath = findIndexPath(
    message.data.manifest,
    message.data.sourceFile,
    "vue",
  );
  if (!indexPath) {
    console.warn("[HMR] Vue index path not found, reloading");
    window.location.reload();
    return;
  }
  const modulePath = `${indexPath}?t=${Date.now()}`;
  import(modulePath)
    .then(() => {
      handleVueImportSuccess(vueRoot, vueDomState);
      return;
    })
    .catch((err) => {
      console.warn("[HMR] Vue import failed:", err);
      sessionStorage.removeItem("__HMR_ACTIVE__");
      window.location.reload();
    });
};

// node_modules/@absolutejs/absolute/dist/dev/client/handlers/rebuild.ts
var handleFullReload = () => {
  setTimeout(() => {
    window.location.reload();
  }, REBUILD_RELOAD_DELAY_MS);
};
var handleManifest = (message) => {
  window.__HMR_MANIFEST__ = message.data.manifest;
  if (message.data.serverVersions) {
    window.__HMR_SERVER_VERSIONS__ = message.data.serverVersions;
  }
  if (!window.__HMR_MODULE_VERSIONS__) {
    window.__HMR_MODULE_VERSIONS__ = {};
  }
  window.__HMR_MODULE_UPDATES__ = [];
};
var HMR_FRAMEWORKS = ["angular", "react", "vue", "svelte", "html", "htmx"];
var mergeRecord = (source2, target) => {
  Object.keys(source2)
    .filter((key2) => Object.prototype.hasOwnProperty.call(source2, key2))
    .forEach((key2) => {
      const value = source2[key2];
      if (value !== undefined) {
        target[key2] = value;
      }
    });
};
var mergeServerVersions = (serverVersions) => {
  if (!serverVersions) return;
  const existing = window.__HMR_SERVER_VERSIONS__ ?? {};
  mergeRecord(serverVersions, existing);
  window.__HMR_SERVER_VERSIONS__ = existing;
};
var mergeModuleVersions = (moduleVersions) => {
  if (!moduleVersions) return;
  const existing = window.__HMR_MODULE_VERSIONS__ ?? {};
  mergeRecord(moduleVersions, existing);
  window.__HMR_MODULE_VERSIONS__ = existing;
};
var mergeManifest = (manifest) => {
  if (!manifest) return;
  const existing = window.__HMR_MANIFEST__ ?? {};
  mergeRecord(manifest, existing);
  window.__HMR_MANIFEST__ = existing;
};
var handleModuleUpdate = (message) => {
  const hasHMRHandler = HMR_FRAMEWORKS.includes(message.data.framework || "");
  if (!hasHMRHandler) {
    window.location.reload();
    return;
  }
  mergeServerVersions(message.data.serverVersions);
  mergeModuleVersions(message.data.moduleVersions);
  mergeManifest(message.data.manifest);
  if (!window.__HMR_MODULE_UPDATES__) {
    window.__HMR_MODULE_UPDATES__ = [];
  }
  window.__HMR_MODULE_UPDATES__.push(message.data);
};
var handleRebuildComplete = (message) => {
  if (!isRuntimeErrorOverlay()) {
    hideErrorOverlay();
  }
  if (window.__HMR_MANIFEST__) {
    window.__HMR_MANIFEST__ = message.data.manifest;
  }
  if (
    message.data.affectedFrameworks &&
    !message.data.affectedFrameworks.includes("angular") &&
    !message.data.affectedFrameworks.includes("react") &&
    !message.data.affectedFrameworks.includes("html") &&
    !message.data.affectedFrameworks.includes("htmx") &&
    !message.data.affectedFrameworks.includes("vue") &&
    !message.data.affectedFrameworks.includes("svelte")
  ) {
    const url = new URL(window.location.href);
    url.searchParams.set("_cb", Date.now().toString());
    window.location.href = url.toString();
  }
};
var handleRebuildError = (message) => {
  const errData = message.data || {};
  showErrorOverlay({
    column: errData.column,
    file: errData.file,
    framework:
      errData.framework ||
      (errData.affectedFrameworks && errData.affectedFrameworks[0]),
    line: errData.line,
    lineText: errData.lineText,
    message: errData.error || "Build failed",
  });
};

// node_modules/@absolutejs/absolute/dist/dev/client/hmrClient.ts
if (typeof window !== "undefined") {
  if (!window.__HMR_MANIFEST__) {
    window.__HMR_MANIFEST__ = {};
  }
  if (!window.__HMR_MODULE_UPDATES__) {
    window.__HMR_MODULE_UPDATES__ = [];
  }
  if (!window.__HMR_MODULE_VERSIONS__) {
    window.__HMR_MODULE_VERSIONS__ = {};
  }
  if (!window.__HMR_SERVER_VERSIONS__) {
    window.__HMR_SERVER_VERSIONS__ = {};
  }
}
window.addEventListener("error", (evt) => {
  if (!evt.error) return;
  showErrorOverlay({
    framework: detectCurrentFramework() || undefined,
    kind: "runtime",
    message:
      evt.error instanceof Error
        ? evt.error.stack || evt.error.message
        : String(evt.error),
  });
});
window.addEventListener("unhandledrejection", (evt) => {
  if (!evt.reason) return;
  showErrorOverlay({
    framework: detectCurrentFramework() || undefined,
    kind: "runtime",
    message:
      evt.reason instanceof Error
        ? evt.reason.stack || evt.reason.message
        : String(evt.reason),
  });
});
var hmrUpdateTypes = new Set([
  "angular-update",
  "react-update",
  "html-update",
  "htmx-update",
  "vue-update",
  "svelte-update",
  "style-update",
  "module-update",
  "rebuild-start",
]);
var handleHMRMessage = (message) => {
  if (hmrUpdateTypes.has(message.type)) {
    hmrState.isHMRUpdating = true;
    setTimeout(() => {
      hmrState.isHMRUpdating = false;
    }, HMR_UPDATE_TIMEOUT_MS);
  }
  switch (message.type) {
    case "manifest":
      handleManifest(message);
      break;
    case "rebuild-start":
      break;
    case "rebuild-complete":
      handleRebuildComplete(message);
      break;
    case "framework-update":
      break;
    case "module-update":
      hideErrorOverlay();
      handleModuleUpdate(message);
      break;
    case "react-update":
      handleReactUpdate(message);
      break;
    case "script-update":
      hideErrorOverlay();
      handleScriptUpdate(message);
      break;
    case "html-update":
      hideErrorOverlay();
      handleHTMLUpdate(message);
      break;
    case "htmx-update":
      hideErrorOverlay();
      handleHTMXUpdate(message);
      break;
    case "svelte-update":
      hideErrorOverlay();
      handleSvelteUpdate(message);
      break;
    case "vue-update":
      hideErrorOverlay();
      handleVueUpdate(message);
      break;
    case "angular-update":
      hideErrorOverlay();
      handleAngularUpdate(message);
      break;
    case "rebuild-error":
      handleRebuildError(message);
      break;
    case "full-reload":
      handleFullReload();
      break;
    case "pong":
      break;
    case "style-update":
      reloadCSSStylesheets(message.data.manifest);
      break;
    default:
      break;
  }
};
if (!(window.__HMR_WS__ && window.__HMR_WS__.readyState === WebSocket.OPEN)) {
  const wsHost = location.hostname;
  const wsPort =
    location.port || (location.protocol === "https:" ? "443" : "80");
  const wsProtocol = location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProtocol}://${wsHost}:${wsPort}/hmr`;
  const wsc = new WebSocket(wsUrl);
  window.__HMR_WS__ = wsc;
  wsc.onopen = function () {
    hmrState.isConnected = true;
    sessionStorage.setItem("__HMR_CONNECTED__", "true");
    const currentFramework = detectCurrentFramework();
    wsc.send(
      JSON.stringify({
        framework: currentFramework,
        type: "ready",
      }),
    );
    if (hmrState.reconnectTimeout) {
      clearTimeout(hmrState.reconnectTimeout);
      hmrState.reconnectTimeout = null;
    }
    hmrState.pingInterval = setInterval(() => {
      if (wsc.readyState === WebSocket.OPEN && hmrState.isConnected) {
        wsc.send(JSON.stringify({ type: "ping" }));
      }
    }, PING_INTERVAL_MS);
  };
  wsc.onmessage = function (event2) {
    let message;
    try {
      message = JSON.parse(event2.data);
    } catch {
      return;
    }
    handleHMRMessage(message);
  };
  wsc.onclose = function (event2) {
    hmrState.isConnected = false;
    if (hmrState.pingInterval) {
      clearInterval(hmrState.pingInterval);
      hmrState.pingInterval = null;
    }
    if (event2.code !== WEBSOCKET_NORMAL_CLOSURE) {
      let attempts = 0;
      hmrState.reconnectTimeout = setTimeout(function pollServer() {
        attempts++;
        if (attempts > MAX_RECONNECT_ATTEMPTS) return;
        fetch("/hmr-status", { cache: "no-store" })
          .then((res) => {
            if (res.ok) {
              window.location.reload();
            } else {
              hmrState.reconnectTimeout = setTimeout(
                pollServer,
                RECONNECT_POLL_INTERVAL_MS,
              );
            }
            return;
          })
          .catch(() => {
            hmrState.reconnectTimeout = setTimeout(
              pollServer,
              RECONNECT_POLL_INTERVAL_MS,
            );
          });
      }, RECONNECT_INITIAL_DELAY_MS);
    }
  };
  wsc.onerror = function () {
    hmrState.isConnected = false;
  };
  window.addEventListener("beforeunload", () => {
    if (hmrState.isHMRUpdating) {
      if (hmrState.pingInterval) clearInterval(hmrState.pingInterval);
      if (hmrState.reconnectTimeout) clearTimeout(hmrState.reconnectTimeout);
      return;
    }
    if (hmrState.pingInterval) clearInterval(hmrState.pingInterval);
    if (hmrState.reconnectTimeout) clearTimeout(hmrState.reconnectTimeout);
  });
}

// src/frontend/svelte/indexes/pages/TestPage.js
window.__HMR_FRAMEWORK__ = "svelte";
var initialProps =
  typeof window !== "undefined" && window.__INITIAL_PROPS__
    ? window.__INITIAL_PROPS__
    : {};
var isHMR =
  typeof window !== "undefined" && window.__SVELTE_COMPONENT__ !== undefined;
var component2;
if (isHMR) {
  preservedState = window.__HMR_PRESERVED_STATE__;
  if (!preservedState) {
    try {
      stored = sessionStorage.getItem("__SVELTE_HMR_STATE__");
      if (stored) preservedState = JSON.parse(stored);
    } catch (err) {}
  }
  mergedProps =
    preservedState && Object.keys(preservedState).length > 0
      ? Object.assign({}, initialProps, preservedState)
      : initialProps;
  if (typeof window.__SVELTE_UNMOUNT__ === "function") {
    try {
      window.__SVELTE_UNMOUNT__();
    } catch (err) {}
  }
  component2 = mount(TestPage, { target: document.body, props: mergedProps });
  window.__HMR_PRESERVED_STATE__ = undefined;
} else {
  component2 = hydrate(TestPage, {
    target: document.body,
    props: initialProps,
  });
}
var preservedState;
var stored;
var mergedProps;
if (typeof window !== "undefined") {
  window.__SVELTE_COMPONENT__ = component2;
  window.__SVELTE_UNMOUNT__ = function () {
    unmount(component2);
  };
}
