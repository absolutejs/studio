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
var get_descriptors = Object.getOwnPropertyDescriptors;
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
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_FRAGMENT_NODE = 11;

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (true_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
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
function await_waterfall(name, location) {
  if (true_default) {
    console.warn(
      `%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function event_handler_invalid(handler, suggestion) {
  if (true_default) {
    console.warn(
      `%c[svelte] event_handler_invalid
%c${handler} should be a function. Did you mean to ${suggestion}?
https://svelte.dev/e/event_handler_invalid`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/event_handler_invalid`);
  }
}
function hydration_attribute_changed(attribute, html, value) {
  if (true_default) {
    console.warn(
      `%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,
      bold,
      normal,
    );
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_mismatch(location) {
  if (true_default) {
    console.warn(
      `%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
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
function reset(node) {
  if (!hydrating) return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
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
function add_svelte_meta(callback, type, component, line, column, additional) {
  const parent = dev_stack;
  dev_stack = {
    type,
    file: component[FILENAME],
    line,
    column,
    parent,
    ...additional,
  };
  try {
    return callback();
  } finally {
    dev_stack = parent;
  }
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
    const reset2 = () => {
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
        onerror?.(transformed_error, reset2);
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
                () => reset2,
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

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  var pending = blockers.filter((b) => !b.settled);
  if (async.length === 0 && pending.length === 0) {
    fn(sync.map(d));
    return;
  }
  var batch = current_batch;
  var parent = active_effect;
  var restore = capture();
  var blocker_promise =
    pending.length === 1
      ? pending[0].promise
      : pending.length > 1
        ? Promise.all(pending.map((b) => b.promise))
        : null;
  function finish(values) {
    restore();
    try {
      fn(values);
    } catch (error) {
      if ((parent.f & DESTROYED) === 0) {
        invoke_error_boundary(error, parent);
      }
    }
    unset_context();
  }
  if (async.length === 0) {
    blocker_promise.then(() => finish(sync.map(d)));
    return;
  }
  function run() {
    restore();
    Promise.all(async.map((expression) => async_derived(expression)))
      .then((result) => finish([...sync.map(d), ...result]))
      .catch((error) => invoke_error_boundary(error, parent));
  }
  if (blocker_promise) {
    blocker_promise.then(run);
  } else {
    run();
  }
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch2 = current_batch;
  if (true_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch) previous_batch2?.activate();
    if (true_default) {
      set_from_async_derived(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context(deactivate_batch = true) {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (deactivate_batch) current_batch?.deactivate();
  if (true_default) {
    set_from_async_derived(null);
    set_dev_stack(null);
  }
}
function increment_pending() {
  var boundary2 = active_effect.b;
  var batch = current_batch;
  var blocking = boundary2.is_rendered();
  boundary2.update_pending_count(1);
  batch.increment(blocking);
  return () => {
    boundary2.update_pending_count(-1);
    batch.decrement(blocking);
  };
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var current_async_effect = null;
function set_from_async_derived(v) {
  current_async_effect = v;
}
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
function async_derived(fn, label, location) {
  let parent = active_effect;
  if (parent === null) {
    async_derived_orphan();
  }
  var promise = undefined;
  var signal = source(UNINITIALIZED);
  if (true_default) signal.label = label;
  var should_suspend = !active_reaction;
  var deferreds = new Map();
  async_effect(() => {
    if (true_default) current_async_effect = active_effect;
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, d.reject).finally(unset_context);
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (true_default) current_async_effect = null;
    var batch = current_batch;
    if (should_suspend) {
      var decrement_pending = increment_pending();
      deferreds.get(batch)?.reject(STALE_REACTION);
      deferreds.delete(batch);
      deferreds.set(batch, d);
    }
    const handler = (value, error = undefined) => {
      current_async_effect = null;
      batch.activate();
      if (error) {
        if (error !== STALE_REACTION) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        }
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        internal_set(signal, value);
        for (const [b, d2] of deferreds) {
          deferreds.delete(b);
          if (b === batch) break;
          d2.reject(STALE_REACTION);
        }
        if (true_default && location !== undefined) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal)) {
              await_waterfall(signal.label, location);
              recent_async_deriveds.delete(signal);
            }
          });
        }
      }
      if (decrement_pending) {
        decrement_pending();
      }
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds.values()) {
      d.reject(STALE_REACTION);
    }
  });
  if (true_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
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
function strict_equals(a, b, equal = true) {
  try {
    if ((a === b) !== (get_proxied_value(a) === get_proxied_value(b))) {
      state_proxy_equality_mismatch(equal ? "===" : "!==");
    }
  } catch {}
  return (a === b) === equal;
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
function child(node, is_text) {
  if (!hydrating) {
    return get_first_child(node);
  }
  var child2 = get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text = create_text();
    child2?.before(text);
    set_hydrate_node(text);
    return text;
  }
  if (is_text) {
    merge_text_nodes(child2);
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  if (!hydrating) {
    var first = get_first_child(node);
    if (first instanceof Comment && first.data === "")
      return get_next_sibling(first);
    return first;
  }
  if (is_text) {
    if (hydrate_node?.nodeType !== TEXT_NODE) {
      var text = create_text();
      hydrate_node?.before(text);
      set_hydrate_node(text);
      return text;
    }
    merge_text_nodes(hydrate_node);
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text) {
    if (next_sibling?.nodeType !== TEXT_NODE) {
      var text = create_text();
      if (next_sibling === null) {
        last_sibling?.after(text);
      } else {
        next_sibling.before(text);
      }
      set_hydrate_node(text);
      return text;
    }
    merge_text_nodes(next_sibling);
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
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
function merge_text_nodes(text) {
  if (text.nodeValue.length < 65536) {
    return;
  }
  let next2 = text.nextSibling;
  while (next2 !== null && next2.nodeType === TEXT_NODE) {
    next2.remove();
    text.nodeValue += next2.nodeValue;
    next2 = text.nextSibling;
  }
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
function teardown(fn) {
  const effect = create_effect(RENDER_EFFECT, null, false);
  set_signal_status(effect, CLEAN);
  effect.teardown = fn;
  return effect;
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
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn, true);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn, true);
}
function template_effect(fn, sync = [], async = [], blockers = []) {
  flatten(blockers, sync, async, (values) => {
    create_effect(RENDER_EFFECT, () => fn(...values.map(get)), true);
  });
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
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent =
      (child2.f & EFFECT_TRANSPARENT) !== 0 ||
      ((child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0);
    pause_children(child2, transitions, transparent ? local : false);
    child2 = sibling2;
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
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent =
      (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
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
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event);
    }
    if (!event.cancelBubble) {
      return without_reactive_context(() => {
        return handler?.call(this, event);
      });
    }
  }
  if (
    event_name.startsWith("pointer") ||
    event_name.startsWith("touch") ||
    event_name === "wheel"
  ) {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function event(event_name, dom, handler, capture2, passive) {
  var options = { capture: capture2, passive };
  var target_handler = create_event(event_name, dom, handler, options);
  if (
    dom === document.body ||
    dom === window ||
    dom === document ||
    dom instanceof HTMLMediaElement
  ) {
    teardown(() => {
      dom.removeEventListener(event_name, target_handler, options);
    });
  }
}
function delegated(event_name, element, handler) {
  (element[event_symbol] ??= {})[event_name] = handler;
}
function delegate(events) {
  for (var i = 0; i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
function handle_event_propagation(event2) {
  var handler_element = this;
  var owner_document = handler_element.ownerDocument;
  var event_name = event2.type;
  var path = event2.composedPath?.() || [];
  var current_target = path[0] || event2.target;
  last_propagated_event = event2;
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (
      at_idx !== -1 &&
      (handler_element === document || handler_element === window)
    ) {
      event2[event_symbol] = handler_element;
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
  current_target = path[path_idx] || event2.target;
  if (current_target === handler_element) return;
  define_property(event2, "currentTarget", {
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
        var delegated2 = current_target[event_symbol]?.[event_name];
        if (
          delegated2 != null &&
          (!current_target.disabled || event2.target === current_target)
        ) {
          delegated2.call(current_target, event2);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (
        event2.cancelBubble ||
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
    event2[event_symbol] = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function apply(
  thunk,
  element,
  args,
  component,
  loc,
  has_side_effects = false,
  remove_parens = false,
) {
  let handler;
  let error;
  try {
    handler = thunk();
  } catch (e) {
    error = e;
  }
  if (
    typeof handler !== "function" &&
    (has_side_effects || handler != null || error)
  ) {
    const filename = component?.[FILENAME];
    const location = loc
      ? ` at ${filename}:${loc[0]}:${loc[1]}`
      : ` in ${filename}`;
    const phase = args[0]?.eventPhase < Event.BUBBLING_PHASE ? "capture" : "";
    const event_name = args[0]?.type + phase;
    const description = `\`${event_name}\` handler${location}`;
    const suggestion = remove_parens
      ? "remove the trailing `()`"
      : "add a leading `() =>`";
    event_handler_invalid(description, suggestion);
    if (error) {
      throw error;
    }
  }
  handler?.apply(element, args);
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
function set_text(text, value) {
  var str = value == null ? "" : typeof value === "object" ? value + "" : value;
  if (str !== (text.__t ??= text.nodeValue)) {
    text.__t = str;
    text.nodeValue = str + "";
  }
}
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
function register_style(hash, style) {
  var styles = all_styles.get(hash);
  if (!styles) {
    styles = new Set();
    all_styles.set(hash, styles);
  }
  styles.add(style);
}
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
function assign_location(element, filename, location) {
  element.__svelte_meta = {
    parent: dev_stack,
    loc: { file: filename, line: location[0], column: location[1] },
  };
  if (location[2]) {
    assign_locations(element.firstChild, filename, location[2]);
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
// node_modules/svelte/src/internal/client/dom/css.js
function append_styles(anchor, css) {
  effect(() => {
    var root = anchor.getRootNode();
    var target = root.host ? root : (root.head ?? root.ownerDocument.head);
    if (!target.querySelector("#" + css.hash)) {
      const style = create_element("style");
      style.id = css.hash;
      style.textContent = css.code;
      target.appendChild(style);
      if (true_default) {
        register_style(css.hash, style);
      }
    }
  });
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
var LINK_TAG = IS_XHTML ? "link" : "LINK";
function set_attribute2(element, attribute, value, skip_warning) {
  var attributes = get_attributes(element);
  if (hydrating) {
    attributes[attribute] = element.getAttribute(attribute);
    if (
      attribute === "src" ||
      attribute === "srcset" ||
      (attribute === "href" && element.nodeName === LINK_TAG)
    ) {
      if (!skip_warning) {
        check_src_in_dev_hydration(element, attribute, value ?? "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value)) return;
  if (attribute === "loading") {
    element[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element.removeAttribute(attribute);
  } else if (
    typeof value !== "string" &&
    get_setters(element).includes(attribute)
  ) {
    element[attribute] = value;
  } else {
    element.setAttribute(attribute, value);
  }
}
function get_attributes(element) {
  return (element.__attributes ??= {
    [IS_CUSTOM_ELEMENT]: element.nodeName.includes("-"),
    [IS_HTML]: element.namespaceURI === NAMESPACE_HTML,
  });
}
var setters_cache = new Map();
function get_setters(element) {
  var cache_key = element.getAttribute("is") || element.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters) return setters;
  setters_cache.set(cache_key, (setters = []));
  var descriptors;
  var proto = element;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key in descriptors) {
      if (descriptors[key].set) {
        setters.push(key);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element, attribute, value) {
  if (!true_default) return;
  if (attribute === "srcset" && srcset_url_equal(element, value)) return;
  if (src_url_equal(element.getAttribute(attribute) ?? "", value)) return;
  hydration_attribute_changed(
    attribute,
    element.outerHTML.replace(element.innerHTML, element.innerHTML && "..."),
    String(value),
  );
}
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  return (
    new URL(element_src, document.baseURI).href ===
    new URL(url, document.baseURI).href
  );
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element, srcset) {
  var element_urls = split_srcset(element.srcset);
  var urls = split_srcset(srcset);
  return (
    urls.length === element_urls.length &&
    urls.every(
      ([url, width], i) =>
        width === element_urls[i][1] &&
        (src_url_equal(element_urls[i][0], url) ||
          src_url_equal(url, element_urls[i][0])),
    )
  );
}
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
// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function is_bound_this(bound_value, element_or_component) {
  return (
    bound_value === element_or_component ||
    bound_value?.[STATE_SYMBOL] === element_or_component
  );
}
function bind_this(element_or_component = {}, update2, get_value, get_parts) {
  effect(() => {
    var old_parts;
    var parts;
    render_effect(() => {
      old_parts = parts;
      parts = get_parts?.() || [];
      untrack(() => {
        if (element_or_component !== get_value(...parts)) {
          update2(element_or_component, ...parts);
          if (
            old_parts &&
            is_bound_this(get_value(...old_parts), element_or_component)
          ) {
            update2(null, ...old_parts);
          }
        }
      });
    });
    return () => {
      queue_micro_task(() => {
        if (parts && is_bound_this(get_value(...parts), element_or_component)) {
          update2(null, ...parts);
        }
      });
    };
  });
  return element_or_component;
}
// node_modules/svelte/src/internal/client/reactivity/store.js
var IS_UNMOUNTED = Symbol();
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
        get(target, prop) {
          return get(
            sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)),
          );
        },
        has(target, prop) {
          if (prop === LEGACY_PROPS) return true;
          get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
          return Reflect.has(target, prop);
        },
        set(target, prop, value) {
          set(sources.get(prop) ?? add_source(prop, value), value);
          return Reflect.set(target, prop, value);
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
function get_custom_element_value(prop, value, props_definition, transform) {
  const type = props_definition[prop]?.type;
  value =
    type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop]) {
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
// src/frontend/svelte/client/composables/counter.js
var counter = (initialCount) => {
  let count = tag(state(proxy(initialCount)), "count");
  const getCount = () => get(count);
  const increment2 = () => {
    set(count, get(count) + 1);
  };
  return { getCount, increment: increment2 };
};

// src/frontend/svelte/client/components/Counter.js
Counter[FILENAME] = "src/frontend/svelte/components/Counter.js";
var root = add_locations(
  from_html(`<button class="svelte-ajb1bf"> </button>`),
  Counter[FILENAME],
  [[11, 0]],
);
var $$css = {
  hash: "svelte-ajb1bf",
  code: `
	button.svelte-ajb1bf:hover {
		border-color: #ff3e00;
	}

	@media (prefers-color-scheme: light) {
		button.svelte-ajb1bf {
			background-color: #ffffff;
		}
	}

/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ291bnRlci5zdmVsdGUiLCJzb3VyY2VzIjpbIkNvdW50ZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdHR5cGUgQ291bnRlclByb3BzID0ge1xuXHRcdGluaXRpYWxDb3VudDogbnVtYmVyO1xuXHR9O1xuXG5cdGxldCB7IGluaXRpYWxDb3VudCB9OiBDb3VudGVyUHJvcHMgPSAkcHJvcHMoKTtcblx0aW1wb3J0IHsgY291bnRlciB9IGZyb20gJy4uL2NvbXBvc2FibGVzL2NvdW50ZXIuc3ZlbHRlJztcblx0Y29uc3QgeyBnZXRDb3VudCwgaW5jcmVtZW50IH0gPSBjb3VudGVyKGluaXRpYWxDb3VudCk7XG48L3NjcmlwdD5cblxuPGJ1dHRvbiBvbmNsaWNrPXtpbmNyZW1lbnR9PmNvdW50IGlzIHtnZXRDb3VudCgpfTwvYnV0dG9uPlxuXG48c3R5bGU+XG5cdGJ1dHRvbjpob3ZlciB7XG5cdFx0Ym9yZGVyLWNvbG9yOiAjZmYzZTAwO1xuXHR9XG5cblx0QG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogbGlnaHQpIHtcblx0XHRidXR0b24ge1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcblx0XHR9XG5cdH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQWFBLENBQUMsb0JBQU0sTUFBTSxDQUFDO0FBQ2QsRUFBRSxxQkFBcUI7QUFDdkI7O0FBRUEsQ0FBQyxxQ0FBcUM7QUFDdEMsRUFBRSxvQkFBTSxDQUFDO0FBQ1QsR0FBRyx5QkFBeUI7QUFDNUI7QUFDQTsifQ== */`,
};
function Counter($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, Counter);
  append_styles($$anchor, $$css);
  const { getCount, increment: increment2 } = counter($$props.initialCount);
  var $$exports = { ...legacy_api() };
  var button = root();
  var text2 = child(button);
  reset(button);
  template_effect(($0) => set_text(text2, `count is ${$0 ?? ""}`), [getCount]);
  delegated("click", button, function (...$$args) {
    apply(() => increment2, this, $$args, Counter, [11, 17]);
  });
  append($$anchor, button);
  return pop($$exports);
}
delegate(["click"]);

// src/frontend/svelte/client/pages/SvelteExample.js
SvelteExample[FILENAME] = "src/frontend/svelte/pages/SvelteExample.js";
var root_1 = add_locations(
  from_html(
    `<meta charset="utf-8"/> <meta name="description" content="AbsoluteJS Svelte Example"/> <meta name="viewport" content="width=device-width, initial-scale=1"/> <link rel="icon" href="/assets/ico/favicon.ico"/> <link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/> <link rel="stylesheet"/> <link rel="stylesheet" type="text/css"/>`,
    1,
  ),
  SvelteExample[FILENAME],
  [
    [25, 1],
    [27, 1],
    [28, 1],
    [29, 1],
    [30, 1],
    [31, 1],
    [36, 1],
    [40, 1],
  ],
);
var root2 = add_locations(
  from_html(
    `<header class="svelte-vc5xx0"><a href="/" class="svelte-vc5xx0">AbsoluteJS</a> <details class="svelte-vc5xx0"><summary class="svelte-vc5xx0">Pages</summary> <nav class="svelte-vc5xx0"><a href="/react" class="svelte-vc5xx0">React</a> <a href="/html" class="svelte-vc5xx0">HTML</a> <a href="/svelte" class="svelte-vc5xx0">Svelte</a> <a href="/vue" class="svelte-vc5xx0">Vue</a> <a href="/htmx" class="svelte-vc5xx0">HTMX</a> <a href="/angular" class="svelte-vc5xx0">Angular</a></nav></details></header> <main><nav class="svelte-vc5xx0"><a href="https://absolutejs.com" target="_blank"><img class="logo svelte-vc5xx0" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo"/></a> <a href="https://svelte.dev" target="_blank"><img class="logo svelte svelte-vc5xx0" src="/assets/svg/svelte-logo.svg" alt="Svelte Logo"/></a></nav> <h1 class="svelte-vc5xx0">AbsoluteJS + Svelte</h1> <!> <p>Edit <code class="svelte-vc5xx0">src/frontend/svelte/pages/SvelteExample.svelte</code> and save
		to test HMR.</p> <p style="margin-top: 2rem;">Explore the other pages to see multiple frameworks running together.</p> <p style="color: #777; font-size: 1rem; margin-top: 2rem;">Click on the AbsoluteJS and Svelte logos to learn more.</p></main>`,
    1,
  ),
  SvelteExample[FILENAME],
  [
    [
      43,
      0,
      [
        [44, 1],
        [
          45,
          1,
          [
            [50, 2],
            [
              51,
              2,
              [
                [52, 3],
                [53, 3],
                [54, 3],
                [55, 3],
                [56, 3],
                [57, 3],
              ],
            ],
          ],
        ],
      ],
    ],
    [
      62,
      0,
      [
        [
          63,
          1,
          [
            [64, 2, [[65, 3]]],
            [71, 2, [[72, 3]]],
          ],
        ],
        [79, 1],
        [81, 1, [[82, 7]]],
        [85, 1],
        [88, 1],
      ],
    ],
  ],
);
var $$css2 = {
  hash: "svelte-vc5xx0",
  code: `
	header.svelte-vc5xx0 {
		align-items: center;
		background-color: #1a1a1a;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: space-between;
		padding: 2rem;
		text-align: center;
	}

	header.svelte-vc5xx0 a:where(.svelte-vc5xx0) {
		position: relative;
		color: #5fbeeb;
		text-decoration: none;
	}

	header.svelte-vc5xx0 a:where(.svelte-vc5xx0)::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(
			90deg,
			#5fbeeb 0%,
			#35d5a2 50%,
			#ff4b91 100%
		);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.25s ease-in-out;
	}

	header.svelte-vc5xx0 a:where(.svelte-vc5xx0):hover::after {
		transform: scaleX(1);
	}

	h1.svelte-vc5xx0 {
		font-size: 2.5rem;
		margin-top: 2rem;
	}

	.logo.svelte-vc5xx0 {
		height: 8rem;
		width: 8rem;
		will-change: filter;
		transition: filter 300ms;
	}

	.logo.svelte-vc5xx0:hover {
		filter: drop-shadow(0 0 2rem #5fbeeb);
	}

	.logo.svelte.svelte-vc5xx0:hover {
		filter: drop-shadow(0 0 2rem #ff3e00);
	}

	/* (unused) button:hover {
		border-color: #ff3e00;
	}*/

	nav.svelte-vc5xx0 {
		display: flex;
		gap: 4rem;
		justify-content: center;
	}

	header.svelte-vc5xx0 details:where(.svelte-vc5xx0) {
		position: relative;
	}

	header.svelte-vc5xx0 details:where(.svelte-vc5xx0) summary:where(.svelte-vc5xx0) {
		list-style: none;
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		user-select: none;
		color: #5fbeeb;
		font-size: 1.5rem;
		font-weight: 500;
		padding: 0.5rem 1rem;
	}

	header.svelte-vc5xx0 summary:where(.svelte-vc5xx0)::after {
		content: '▼';
		display: inline-block;
		margin-left: 0.5rem;
		font-size: 0.75rem;
		transition: transform 0.3s ease;
	}

	header.svelte-vc5xx0 details[open]:where(.svelte-vc5xx0) summary:where(.svelte-vc5xx0)::after {
		transform: rotate(180deg);
	}

	header.svelte-vc5xx0 details:where(.svelte-vc5xx0) nav:where(.svelte-vc5xx0) {
		content-visibility: visible;
		position: absolute;
		top: 100%;
		right: -0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: rgba(185, 185, 185, 0.1);
		backdrop-filter: blur(4px);
		border: 1px solid #5fbeeb;
		border-radius: 1rem;
		padding: 1rem 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		opacity: 0;
		transform: translateY(-8px);
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
		z-index: 1000;
	}

	header.svelte-vc5xx0 details[open]:where(.svelte-vc5xx0) nav:where(.svelte-vc5xx0) {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}

	header.svelte-vc5xx0 details:where(.svelte-vc5xx0) nav:where(.svelte-vc5xx0) a:where(.svelte-vc5xx0) {
		font-size: 1.1rem;
		padding: 0.25rem 0;
		white-space: nowrap;
	}

	@media (max-width: 480px) {
		header.svelte-vc5xx0 {
			padding: 1rem;
		}

		h1.svelte-vc5xx0 {
			font-size: 1.75rem;
		}

		.logo.svelte-vc5xx0 {
			height: 5rem;
			width: 5rem;
		}

		nav.svelte-vc5xx0 {
			gap: 2rem;
		}

		header.svelte-vc5xx0 details:where(.svelte-vc5xx0) summary:where(.svelte-vc5xx0) {
			font-size: 1.2rem;
		}
	}

	code.svelte-vc5xx0 {
		background-color: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.375rem;
		font-family:
			'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo,
			monospace;
		font-size: 0.875em;
		padding: 0.2rem 0.5rem;
	}

	@media (prefers-color-scheme: light) {
		header.svelte-vc5xx0 {
			background-color: #ffffff;
		}

		code.svelte-vc5xx0 {
			background-color: rgba(0, 0, 0, 0.06);
			border-color: rgba(0, 0, 0, 0.1);
		}
	}

/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ZlbHRlRXhhbXBsZS5zdmVsdGUiLCJzb3VyY2VzIjpbIlN2ZWx0ZUV4YW1wbGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdHR5cGUgU3ZlbHRlRXhhbXBsZVByb3BzID0ge1xuXHRcdGluaXRpYWxDb3VudDogbnVtYmVyO1xuXHRcdGNzc1BhdGg6IHN0cmluZztcblx0fTtcblx0aW1wb3J0IENvdW50ZXIgZnJvbSAnLi4vY29tcG9uZW50cy9Db3VudGVyLnN2ZWx0ZSc7XG5cblx0bGV0IHsgaW5pdGlhbENvdW50LCBjc3NQYXRoIH06IFN2ZWx0ZUV4YW1wbGVQcm9wcyA9ICRwcm9wcygpO1xuXHRsZXQgZHJvcGRvd246IEhUTUxEZXRhaWxzRWxlbWVudDtcblxuXHRjb25zdCBvcGVuRHJvcGRvd24gPSAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuXHRcdGlmIChldmVudC5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykge1xuXHRcdFx0ZHJvcGRvd24ub3BlbiA9IHRydWU7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnN0IGNsb3NlRHJvcGRvd24gPSAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuXHRcdGlmIChldmVudC5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykge1xuXHRcdFx0ZHJvcGRvd24ub3BlbiA9IGZhbHNlO1xuXHRcdH1cblx0fTtcbjwvc2NyaXB0PlxuXG48c3ZlbHRlOmhlYWQ+XG5cdDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiIC8+XG5cdDx0aXRsZT5BYnNvbHV0ZUpTICsgU3ZlbHRlPC90aXRsZT5cblx0PG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIkFic29sdXRlSlMgU3ZlbHRlIEV4YW1wbGVcIiAvPlxuXHQ8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuXHQ8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9hc3NldHMvaWNvL2Zhdmljb24uaWNvXCIgLz5cblx0PGxpbmsgcmVsPVwicHJlY29ubmVjdFwiIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tXCIgLz5cblx0PGxpbmtcblx0XHRyZWw9XCJwcmVjb25uZWN0XCJcblx0XHRocmVmPVwiaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbVwiXG5cdFx0Y3Jvc3NPcmlnaW49XCJhbm9ueW1vdXNcIlxuXHQvPlxuXHQ8bGlua1xuXHRcdGhyZWY9e2BodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVBvcHBpbnM6d2dodEAxMDAuLjkwMCZkaXNwbGF5PXN3YXBgfVxuXHRcdHJlbD1cInN0eWxlc2hlZXRcIlxuXHQvPlxuXHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj17Y3NzUGF0aH0gdHlwZT1cInRleHQvY3NzXCIgLz5cbjwvc3ZlbHRlOmhlYWQ+XG5cbjxoZWFkZXI+XG5cdDxhIGhyZWY9XCIvXCI+QWJzb2x1dGVKUzwvYT5cblx0PGRldGFpbHNcblx0XHRiaW5kOnRoaXM9e2Ryb3Bkb3dufVxuXHRcdG9ucG9pbnRlcmVudGVyPXtvcGVuRHJvcGRvd259XG5cdFx0b25wb2ludGVybGVhdmU9e2Nsb3NlRHJvcGRvd259XG5cdD5cblx0XHQ8c3VtbWFyeT5QYWdlczwvc3VtbWFyeT5cblx0XHQ8bmF2PlxuXHRcdFx0PGEgaHJlZj1cIi9yZWFjdFwiPlJlYWN0PC9hPlxuXHRcdFx0PGEgaHJlZj1cIi9odG1sXCI+SFRNTDwvYT5cblx0XHRcdDxhIGhyZWY9XCIvc3ZlbHRlXCI+U3ZlbHRlPC9hPlxuXHRcdFx0PGEgaHJlZj1cIi92dWVcIj5WdWU8L2E+XG5cdFx0XHQ8YSBocmVmPVwiL2h0bXhcIj5IVE1YPC9hPlxuXHRcdFx0PGEgaHJlZj1cIi9hbmd1bGFyXCI+QW5ndWxhcjwvYT5cblx0XHQ8L25hdj5cblx0PC9kZXRhaWxzPlxuPC9oZWFkZXI+XG5cbjxtYWluPlxuXHQ8bmF2PlxuXHRcdDxhIGhyZWY9XCJodHRwczovL2Fic29sdXRlanMuY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHQ8aW1nXG5cdFx0XHRcdGNsYXNzPVwibG9nb1wiXG5cdFx0XHRcdHNyYz1cIi9hc3NldHMvcG5nL2Fic29sdXRlanMtdGVtcC5wbmdcIlxuXHRcdFx0XHRhbHQ9XCJBYnNvbHV0ZUpTIExvZ29cIlxuXHRcdFx0Lz5cblx0XHQ8L2E+XG5cdFx0PGEgaHJlZj1cImh0dHBzOi8vc3ZlbHRlLmRldlwiIHRhcmdldD1cIl9ibGFua1wiPlxuXHRcdFx0PGltZ1xuXHRcdFx0XHRjbGFzcz1cImxvZ28gc3ZlbHRlXCJcblx0XHRcdFx0c3JjPVwiL2Fzc2V0cy9zdmcvc3ZlbHRlLWxvZ28uc3ZnXCJcblx0XHRcdFx0YWx0PVwiU3ZlbHRlIExvZ29cIlxuXHRcdFx0Lz5cblx0XHQ8L2E+XG5cdDwvbmF2PlxuXHQ8aDE+QWJzb2x1dGVKUyArIFN2ZWx0ZTwvaDE+XG5cdDxDb3VudGVyIHtpbml0aWFsQ291bnR9IC8+XG5cdDxwPlxuXHRcdEVkaXQgPGNvZGU+c3JjL2Zyb250ZW5kL3N2ZWx0ZS9wYWdlcy9TdmVsdGVFeGFtcGxlLnN2ZWx0ZTwvY29kZT4gYW5kIHNhdmVcblx0XHR0byB0ZXN0IEhNUi5cblx0PC9wPlxuXHQ8cCBzdHlsZT1cIm1hcmdpbi10b3A6IDJyZW07XCI+XG5cdFx0RXhwbG9yZSB0aGUgb3RoZXIgcGFnZXMgdG8gc2VlIG11bHRpcGxlIGZyYW1ld29ya3MgcnVubmluZyB0b2dldGhlci5cblx0PC9wPlxuXHQ8cCBzdHlsZT1cImNvbG9yOiAjNzc3OyBmb250LXNpemU6IDFyZW07IG1hcmdpbi10b3A6IDJyZW07XCI+XG5cdFx0Q2xpY2sgb24gdGhlIEFic29sdXRlSlMgYW5kIFN2ZWx0ZSBsb2dvcyB0byBsZWFybiBtb3JlLlxuXHQ8L3A+XG48L21haW4+XG5cbjxzdHlsZT5cblx0aGVhZGVyIHtcblx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdGJhY2tncm91bmQtY29sb3I6ICMxYTFhMWE7XG5cdFx0Ym94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcblx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcblx0XHRwYWRkaW5nOiAycmVtO1xuXHRcdHRleHQtYWxpZ246IGNlbnRlcjtcblx0fVxuXG5cdGhlYWRlciBhIHtcblx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0Y29sb3I6ICM1ZmJlZWI7XG5cdFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xuXHR9XG5cblx0aGVhZGVyIGE6OmFmdGVyIHtcblx0XHRjb250ZW50OiAnJztcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0bGVmdDogMDtcblx0XHRib3R0b206IDA7XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0aGVpZ2h0OiAycHg7XG5cdFx0YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0OTBkZWcsXG5cdFx0XHQjNWZiZWViIDAlLFxuXHRcdFx0IzM1ZDVhMiA1MCUsXG5cdFx0XHQjZmY0YjkxIDEwMCVcblx0XHQpO1xuXHRcdHRyYW5zZm9ybTogc2NhbGVYKDApO1xuXHRcdHRyYW5zZm9ybS1vcmlnaW46IGxlZnQ7XG5cdFx0dHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMjVzIGVhc2UtaW4tb3V0O1xuXHR9XG5cblx0aGVhZGVyIGE6aG92ZXI6OmFmdGVyIHtcblx0XHR0cmFuc2Zvcm06IHNjYWxlWCgxKTtcblx0fVxuXG5cdGgxIHtcblx0XHRmb250LXNpemU6IDIuNXJlbTtcblx0XHRtYXJnaW4tdG9wOiAycmVtO1xuXHR9XG5cblx0LmxvZ28ge1xuXHRcdGhlaWdodDogOHJlbTtcblx0XHR3aWR0aDogOHJlbTtcblx0XHR3aWxsLWNoYW5nZTogZmlsdGVyO1xuXHRcdHRyYW5zaXRpb246IGZpbHRlciAzMDBtcztcblx0fVxuXG5cdC5sb2dvOmhvdmVyIHtcblx0XHRmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCAycmVtICM1ZmJlZWIpO1xuXHR9XG5cblx0LmxvZ28uc3ZlbHRlOmhvdmVyIHtcblx0XHRmaWx0ZXI6IGRyb3Atc2hhZG93KDAgMCAycmVtICNmZjNlMDApO1xuXHR9XG5cblx0YnV0dG9uOmhvdmVyIHtcblx0XHRib3JkZXItY29sb3I6ICNmZjNlMDA7XG5cdH1cblxuXHRuYXYge1xuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0Z2FwOiA0cmVtO1xuXHRcdGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXHR9XG5cblx0aGVhZGVyIGRldGFpbHMge1xuXHRcdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0fVxuXG5cdGhlYWRlciBkZXRhaWxzIHN1bW1hcnkge1xuXHRcdGxpc3Qtc3R5bGU6IG5vbmU7XG5cdFx0YXBwZWFyYW5jZTogbm9uZTtcblx0XHQtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG5cdFx0Y3Vyc29yOiBwb2ludGVyO1xuXHRcdHVzZXItc2VsZWN0OiBub25lO1xuXHRcdGNvbG9yOiAjNWZiZWViO1xuXHRcdGZvbnQtc2l6ZTogMS41cmVtO1xuXHRcdGZvbnQtd2VpZ2h0OiA1MDA7XG5cdFx0cGFkZGluZzogMC41cmVtIDFyZW07XG5cdH1cblxuXHRoZWFkZXIgc3VtbWFyeTo6YWZ0ZXIge1xuXHRcdGNvbnRlbnQ6ICfilrwnO1xuXHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcblx0XHRtYXJnaW4tbGVmdDogMC41cmVtO1xuXHRcdGZvbnQtc2l6ZTogMC43NXJlbTtcblx0XHR0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuXHR9XG5cblx0aGVhZGVyIGRldGFpbHNbb3Blbl0gc3VtbWFyeTo6YWZ0ZXIge1xuXHRcdHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XG5cdH1cblxuXHRoZWFkZXIgZGV0YWlscyBuYXYge1xuXHRcdGNvbnRlbnQtdmlzaWJpbGl0eTogdmlzaWJsZTtcblx0XHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdFx0dG9wOiAxMDAlO1xuXHRcdHJpZ2h0OiAtMC41cmVtO1xuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0ZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblx0XHRnYXA6IDAuNzVyZW07XG5cdFx0YmFja2dyb3VuZDogcmdiYSgxODUsIDE4NSwgMTg1LCAwLjEpO1xuXHRcdGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xuXHRcdGJvcmRlcjogMXB4IHNvbGlkICM1ZmJlZWI7XG5cdFx0Ym9yZGVyLXJhZGl1czogMXJlbTtcblx0XHRwYWRkaW5nOiAxcmVtIDEuNXJlbTtcblx0XHRib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMCwgMCwgMCwgMC4yNSk7XG5cdFx0b3BhY2l0eTogMDtcblx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLThweCk7XG5cdFx0cG9pbnRlci1ldmVudHM6IG5vbmU7XG5cdFx0dHJhbnNpdGlvbjpcblx0XHRcdG9wYWNpdHkgMC4zcyBlYXNlLFxuXHRcdFx0dHJhbnNmb3JtIDAuM3MgZWFzZTtcblx0XHR6LWluZGV4OiAxMDAwO1xuXHR9XG5cblx0aGVhZGVyIGRldGFpbHNbb3Blbl0gbmF2IHtcblx0XHRvcGFjaXR5OiAxO1xuXHRcdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcblx0XHRwb2ludGVyLWV2ZW50czogYXV0bztcblx0fVxuXG5cdGhlYWRlciBkZXRhaWxzIG5hdiBhIHtcblx0XHRmb250LXNpemU6IDEuMXJlbTtcblx0XHRwYWRkaW5nOiAwLjI1cmVtIDA7XG5cdFx0d2hpdGUtc3BhY2U6IG5vd3JhcDtcblx0fVxuXG5cdEBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkge1xuXHRcdGhlYWRlciB7XG5cdFx0XHRwYWRkaW5nOiAxcmVtO1xuXHRcdH1cblxuXHRcdGgxIHtcblx0XHRcdGZvbnQtc2l6ZTogMS43NXJlbTtcblx0XHR9XG5cblx0XHQubG9nbyB7XG5cdFx0XHRoZWlnaHQ6IDVyZW07XG5cdFx0XHR3aWR0aDogNXJlbTtcblx0XHR9XG5cblx0XHRuYXYge1xuXHRcdFx0Z2FwOiAycmVtO1xuXHRcdH1cblxuXHRcdGhlYWRlciBkZXRhaWxzIHN1bW1hcnkge1xuXHRcdFx0Zm9udC1zaXplOiAxLjJyZW07XG5cdFx0fVxuXHR9XG5cblx0Y29kZSB7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcblx0XHRib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG5cdFx0Ym9yZGVyLXJhZGl1czogMC4zNzVyZW07XG5cdFx0Zm9udC1mYW1pbHk6XG5cdFx0XHQnU0YgTW9ubycsIFNGTW9uby1SZWd1bGFyLCBDb25zb2xhcywgJ0xpYmVyYXRpb24gTW9ubycsIE1lbmxvLFxuXHRcdFx0bW9ub3NwYWNlO1xuXHRcdGZvbnQtc2l6ZTogMC44NzVlbTtcblx0XHRwYWRkaW5nOiAwLjJyZW0gMC41cmVtO1xuXHR9XG5cblx0QG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogbGlnaHQpIHtcblx0XHRoZWFkZXIge1xuXHRcdFx0YmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcblx0XHR9XG5cblx0XHRjb2RlIHtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4wNik7XG5cdFx0XHRib3JkZXItY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTtcblx0XHR9XG5cdH1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQTZGQSxDQUFDLG9CQUFNLENBQUM7QUFDUixFQUFFLG1CQUFtQjtBQUNyQixFQUFFLHlCQUF5QjtBQUMzQixFQUFFLHdDQUF3QztBQUMxQyxFQUFFLGFBQWE7QUFDZixFQUFFLDhCQUE4QjtBQUNoQyxFQUFFLGFBQWE7QUFDZixFQUFFLGtCQUFrQjtBQUNwQjs7QUFFQSxDQUFDLG9CQUFNLENBQUMsdUJBQUMsQ0FBQztBQUNWLEVBQUUsa0JBQWtCO0FBQ3BCLEVBQUUsY0FBYztBQUNoQixFQUFFLHFCQUFxQjtBQUN2Qjs7QUFFQSxDQUFDLG9CQUFNLENBQUMsdUJBQUMsT0FBTyxDQUFDO0FBQ2pCLEVBQUUsV0FBVztBQUNiLEVBQUUsa0JBQWtCO0FBQ3BCLEVBQUUsT0FBTztBQUNULEVBQUUsU0FBUztBQUNYLEVBQUUsV0FBVztBQUNiLEVBQUUsV0FBVztBQUNiLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFLG9CQUFvQjtBQUN0QixFQUFFLHNCQUFzQjtBQUN4QixFQUFFLHVDQUF1QztBQUN6Qzs7QUFFQSxDQUFDLG9CQUFNLENBQUMsdUJBQUMsTUFBTSxPQUFPLENBQUM7QUFDdkIsRUFBRSxvQkFBb0I7QUFDdEI7O0FBRUEsQ0FBQyxnQkFBRSxDQUFDO0FBQ0osRUFBRSxpQkFBaUI7QUFDbkIsRUFBRSxnQkFBZ0I7QUFDbEI7O0FBRUEsQ0FBQyxtQkFBSyxDQUFDO0FBQ1AsRUFBRSxZQUFZO0FBQ2QsRUFBRSxXQUFXO0FBQ2IsRUFBRSxtQkFBbUI7QUFDckIsRUFBRSx3QkFBd0I7QUFDMUI7O0FBRUEsQ0FBQyxtQkFBSyxNQUFNLENBQUM7QUFDYixFQUFFLHFDQUFxQztBQUN2Qzs7QUFFQSxDQUFDLEtBQUsscUJBQU8sTUFBTSxDQUFDO0FBQ3BCLEVBQUUscUNBQXFDO0FBQ3ZDOztBQUVBLGFBQUM7QUFDRDtBQUNBOztBQUVBLENBQUMsaUJBQUcsQ0FBQztBQUNMLEVBQUUsYUFBYTtBQUNmLEVBQUUsU0FBUztBQUNYLEVBQUUsdUJBQXVCO0FBQ3pCOztBQUVBLENBQUMsb0JBQU0sQ0FBQyw2QkFBTyxDQUFDO0FBQ2hCLEVBQUUsa0JBQWtCO0FBQ3BCOztBQUVBLENBQUMsb0JBQU0sQ0FBQyw2QkFBTyxDQUFDLDZCQUFPLENBQUM7QUFDeEIsRUFBRSxnQkFBZ0I7QUFDbEIsRUFBRSxnQkFBZ0I7QUFDbEIsRUFBRSx3QkFBd0I7QUFDMUIsRUFBRSxlQUFlO0FBQ2pCLEVBQUUsaUJBQWlCO0FBQ25CLEVBQUUsY0FBYztBQUNoQixFQUFFLGlCQUFpQjtBQUNuQixFQUFFLGdCQUFnQjtBQUNsQixFQUFFLG9CQUFvQjtBQUN0Qjs7QUFFQSxDQUFDLG9CQUFNLENBQUMsNkJBQU8sT0FBTyxDQUFDO0FBQ3ZCLEVBQUUsWUFBWTtBQUNkLEVBQUUscUJBQXFCO0FBQ3ZCLEVBQUUsbUJBQW1CO0FBQ3JCLEVBQUUsa0JBQWtCO0FBQ3BCLEVBQUUsK0JBQStCO0FBQ2pDOztBQUVBLENBQUMsb0JBQU0sQ0FBQyxPQUFPLDRCQUFNLENBQUMsNkJBQU8sT0FBTyxDQUFDO0FBQ3JDLEVBQUUseUJBQXlCO0FBQzNCOztBQUVBLENBQUMsb0JBQU0sQ0FBQyw2QkFBTyxDQUFDLHlCQUFHLENBQUM7QUFDcEIsRUFBRSwyQkFBMkI7QUFDN0IsRUFBRSxrQkFBa0I7QUFDcEIsRUFBRSxTQUFTO0FBQ1gsRUFBRSxjQUFjO0FBQ2hCLEVBQUUsYUFBYTtBQUNmLEVBQUUsc0JBQXNCO0FBQ3hCLEVBQUUsWUFBWTtBQUNkLEVBQUUsb0NBQW9DO0FBQ3RDLEVBQUUsMEJBQTBCO0FBQzVCLEVBQUUseUJBQXlCO0FBQzNCLEVBQUUsbUJBQW1CO0FBQ3JCLEVBQUUsb0JBQW9CO0FBQ3RCLEVBQUUsMENBQTBDO0FBQzVDLEVBQUUsVUFBVTtBQUNaLEVBQUUsMkJBQTJCO0FBQzdCLEVBQUUsb0JBQW9CO0FBQ3RCLEVBQUU7QUFDRjtBQUNBLHNCQUFzQjtBQUN0QixFQUFFLGFBQWE7QUFDZjs7QUFFQSxDQUFDLG9CQUFNLENBQUMsT0FBTyw0QkFBTSxDQUFDLHlCQUFHLENBQUM7QUFDMUIsRUFBRSxVQUFVO0FBQ1osRUFBRSx3QkFBd0I7QUFDMUIsRUFBRSxvQkFBb0I7QUFDdEI7O0FBRUEsQ0FBQyxvQkFBTSxDQUFDLDZCQUFPLENBQUMseUJBQUcsQ0FBQyx1QkFBQyxDQUFDO0FBQ3RCLEVBQUUsaUJBQWlCO0FBQ25CLEVBQUUsa0JBQWtCO0FBQ3BCLEVBQUUsbUJBQW1CO0FBQ3JCOztBQUVBLENBQUMsMEJBQTBCO0FBQzNCLEVBQUUsb0JBQU0sQ0FBQztBQUNULEdBQUcsYUFBYTtBQUNoQjs7QUFFQSxFQUFFLGdCQUFFLENBQUM7QUFDTCxHQUFHLGtCQUFrQjtBQUNyQjs7QUFFQSxFQUFFLG1CQUFLLENBQUM7QUFDUixHQUFHLFlBQVk7QUFDZixHQUFHLFdBQVc7QUFDZDs7QUFFQSxFQUFFLGlCQUFHLENBQUM7QUFDTixHQUFHLFNBQVM7QUFDWjs7QUFFQSxFQUFFLG9CQUFNLENBQUMsNkJBQU8sQ0FBQyw2QkFBTyxDQUFDO0FBQ3pCLEdBQUcsaUJBQWlCO0FBQ3BCO0FBQ0E7O0FBRUEsQ0FBQyxrQkFBSSxDQUFDO0FBQ04sRUFBRSwyQ0FBMkM7QUFDN0MsRUFBRSwwQ0FBMEM7QUFDNUMsRUFBRSx1QkFBdUI7QUFDekIsRUFBRTtBQUNGO0FBQ0EsWUFBWTtBQUNaLEVBQUUsa0JBQWtCO0FBQ3BCLEVBQUUsc0JBQXNCO0FBQ3hCOztBQUVBLENBQUMscUNBQXFDO0FBQ3RDLEVBQUUsb0JBQU0sQ0FBQztBQUNULEdBQUcseUJBQXlCO0FBQzVCOztBQUVBLEVBQUUsa0JBQUksQ0FBQztBQUNQLEdBQUcscUNBQXFDO0FBQ3hDLEdBQUcsZ0NBQWdDO0FBQ25DO0FBQ0E7In0= */`,
};
function SvelteExample($$anchor, $$props) {
  check_target(new.target);
  push($$props, true, SvelteExample);
  append_styles($$anchor, $$css2);
  let dropdown;
  const openDropdown = (event2) => {
    if (strict_equals(event2.pointerType, "mouse")) {
      dropdown.open = true;
    }
  };
  const closeDropdown = (event2) => {
    if (strict_equals(event2.pointerType, "mouse")) {
      dropdown.open = false;
    }
  };
  var $$exports = { ...legacy_api() };
  var fragment_1 = root2();
  head("vc5xx0", ($$anchor2) => {
    var fragment = root_1();
    var link = sibling(first_child(fragment), 12);
    set_attribute2(
      link,
      "href",
      `https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap`,
    );
    var link_1 = sibling(link, 2);
    template_effect(() => set_attribute2(link_1, "href", $$props.cssPath));
    effect(() => {
      $document.title = "AbsoluteJS + Svelte";
    });
    append($$anchor2, fragment);
  });
  var header = first_child(fragment_1);
  var details = sibling(child(header), 2);
  bind_this(
    details,
    ($$value) => (dropdown = $$value),
    () => dropdown,
  );
  reset(header);
  var main = sibling(header, 2);
  var node = sibling(child(main), 4);
  add_svelte_meta(
    () =>
      Counter(node, {
        get initialCount() {
          return $$props.initialCount;
        },
      }),
    "component",
    SvelteExample,
    80,
    1,
    { componentTag: "Counter" },
  );
  next(6);
  reset(main);
  event("pointerenter", details, openDropdown);
  event("pointerleave", details, closeDropdown);
  append($$anchor, fragment_1);
  return pop($$exports);
}
export { SvelteExample as default };
