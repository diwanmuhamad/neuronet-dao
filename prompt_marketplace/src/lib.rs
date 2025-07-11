use ic_cdk::api::caller;
use ic_cdk_macros::*;
use std::collections::HashMap;

#[derive(Clone, Debug, candid::CandidType, candid::Deserialize)]
pub struct Prompt {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub content: String,
    pub owner: String,
    pub price_icp: u64,
}

thread_local! {
    static PROMPTS: std::cell::RefCell<HashMap<u64, Prompt>> = std::cell::RefCell::new(HashMap::new());
    static NEXT_ID: std::cell::RefCell<u64> = std::cell::RefCell::new(0);
}

#[update]
fn upload_prompt(title: String, description: String, content: String, price_icp: u64) -> Prompt {
    let owner = caller().to_string();
    let prompt = NEXT_ID.with(|id| {
        let new_id = *id.borrow();
        let p = Prompt {
            id: new_id,
            title,
            description,
            content,
            owner,
            price_icp,
        };
        PROMPTS.with(|prompts| prompts.borrow_mut().insert(new_id, p.clone()));
        *id.borrow_mut() += 1;
        p
    });
    prompt
}

#[query]
fn list_prompts() -> Vec<Prompt> {
    PROMPTS.with(|prompts| prompts.borrow().values().cloned().collect())
}